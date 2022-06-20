import axios, { AxiosError, AxiosInstance } from "axios";
import { AxiosOptions, AuthStatus, AuthRequest, AuthenticationState } from "../types/auth";
import { addRoleRequest } from "../types/requests/add-role-to-user";
import { registerRequest } from "../types/requests/register-user-dto";
import { registerFailed, registerSuccess } from "../types/responses/registration-response";
import { AccessToken, AccessTokenPayload, AuthResponse, BaseTokenProviderOptions } from "../types/token";

export class ClientTokenProvider {
    private readonly authBaseUrl = "https://localhost:5001/api/auth";
    private _options: BaseTokenProviderOptions;
    private _accessToken?: AccessToken;
    private requestInterceptor?: number;
    private responseInterceptor?: number;

    constructor(options: BaseTokenProviderOptions) {
        this._options = options;
    }

    public privateAxios(axiosOptions?: AxiosOptions): AxiosInstance {
        const authHeader = { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${this._accessToken?.raw}`, 'Cache-Control': 'no-cache' } };
        const customAxios = axios.create(authHeader);

        this.requestInterceptor = customAxios.interceptors.request.use(async (options) => {
            if (this._accessToken && this.isExpired(this._accessToken?.payload.exp, Date.now())) {
                await this.refreshAccessToken();
                if (!this._accessToken) console.warn('Refresh failed');

                if (options.headers && !options.headers['Authorization']) options.headers['Authorization'] = `Bearer ${this._accessToken?.raw}`;
            }
            return options;
        });

        this.responseInterceptor = customAxios.interceptors.response.use(response => response, async (error) => {
            this.errorHandler(error);
        });

        return customAxios;
    }

    private async refreshAccessToken(): Promise<void> {
        if (!this._accessToken?.refreshToken) {
            this._options.logger?.error("No refresh token found");
            return;
        }
        try {
            const response = await axios.post<AuthResponse>(`${this.authBaseUrl}/api/auth/refresh`, { AccessToken: this._accessToken.raw, RefreshToken: this._accessToken.refreshToken });
            if (response.data.statusCode === 200) {
                const accessToken = this._options.decodeToken(response.data.token.token);
                if (!accessToken) console.error('Could not decode new JWT token');

                this._accessToken = {
                    expires: accessToken.expires,
                    payload: accessToken.payload,
                    raw: accessToken.raw,
                    refreshToken: response.data.token.refreshToken,
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    public async initialLogin(userCredentials: AuthRequest): Promise<AuthenticationState> {
        const response: Promise<AuthenticationState> = axios.post<AuthResponse>(`${this.authBaseUrl}/login`,
            { Email: userCredentials.Emai, Password: userCredentials.Password },
            { headers: { "Content-Type": "application/json" } }).then((res) => {
                const accessToken = this._options.decodeToken(res.data.token.token);
                if (!accessToken) return ({ status: AuthStatus.NOT_AUTHENTICATED, error: Error('No access token'), loading: false }) as AuthenticationState;

                this._accessToken = {
                    expires: accessToken.expires,
                    refreshToken: res.data.token.refreshToken,
                    payload: accessToken.payload,
                    raw: accessToken.raw
                }

                return {
                    timestamp: Date.now(),
                    axios: this.privateAxios(),
                    loading: false,
                    status: AuthStatus.AUTHENTICATED,
                    userInfo: {
                        userName: accessToken.payload.name,
                        userEmail: accessToken.payload.email,
                        userId: accessToken.payload.jti,
                        accountId: 'randmo-acc-id',
                        hasRoleFunction: (...anyOfRfn: string[]): boolean => {
                            const granted: string[]= !Array.isArray(accessToken.payload.roles) ? new Array(accessToken.payload.roles) : accessToken.payload.roles;
                            return !!anyOfRfn.find((rfn) => granted.includes(rfn));
                        }
                    }
                } as AuthenticationState;
            }).catch((err) => {
                return {
                    status: AuthStatus.AUTHENTICATION_FAILED,
                    failure: {
                        error: 'Login failed',
                        errorDescription: err
                    }
                };
            });
        return response;
    }

    public async register(request: registerRequest): Promise<registerSuccess | registerFailed | undefined> {
        try {
            const response = await axios.post(`${this.authBaseUrl}/register`, {
                Email: request.Email,
                FullName: request.FullName,
                Password: request.Password,
                Roles: request.Roles,
            });
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = new AxiosError<registerFailed | any, any>(err.message, err.code, err.config, err.request, err.response);
                return error.response?.data;
            }
        }
    }

    public async addRoleToUser(request: addRoleRequest): Promise<void> {
        const result = await this.privateAxios().patch(`${this.authBaseUrl}/add-role-to-user`, { Email: request.Email, Role: request.Role });
        if (result.status === 200) return;
    }

    public errorHandler(error: any) {
        if ((error as AxiosError).isAxiosError) {
            switch (error.response?.status) {
                case 400:
                    this._options.setError(error);
                    return;
                case 401:
                    this._options.setAuth({
                        failure: {
                            error: 'unauthorized',
                            errorDescription: error.response.statusText,
                        },
                        status: AuthStatus.AUTHENTICATION_FAILED,
                    });
                    return;
                case 403:
                    this._options.setError(error);
                    return;
                default:
                    this._options.setError(error);
            }
        }
        this._options.setAuth({
            status: AuthStatus.NOT_AUTHENTICATED,
            loading: false,
            error: error
        });
    }

    public logOut() {
        this._accessToken = undefined;
    }

    public cleanup() {
        if (this.requestInterceptor && this.responseInterceptor) {
            axios.interceptors.request.eject(this.requestInterceptor);
            axios.interceptors.response.eject(this.responseInterceptor);
        }
    }

    private isExpired(time1: number, time2: number): boolean {
        return time1 > time2;
    }
}

export const decodeToken = <T extends AccessToken>(raw: string): T | null => {
    if (!raw) return null;
    const payload = decomposeJwt(raw);

    if (!payload) return null;
    return { payload, raw, expires: payload.exp * 1000 } as T;
};

export const decomposeJwt = <T extends AccessTokenPayload>(token: string): (T & { exp: number }) | null => {
    if (!token || token.split('.').length !== 3) {
        return null;
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    try {
        const decoded = JSON.parse(decodeURIComponent(window.atob(base64))) as { exp: number } | null;

        return typeof decoded === 'object' && decoded && 'exp' in decoded && typeof decoded.exp === 'number'
            ? decoded as T & { exp: number }
            : null;
    } catch (error) {
        return null;
    }
};