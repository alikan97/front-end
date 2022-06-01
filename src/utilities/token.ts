import axios, { AxiosError, AxiosInstance } from "axios";
import { AxiosOptions, AuthStatus, AuthRequest, AuthenticationState } from "../types/auth";
import { AccessToken, AccessTokenPayload, AuthResponse, BaseTokenProviderOptions } from "../types/token";

export class ClientTokenProvider {
    private readonly authBaseUrl = "https://localhost:5001/api/auth";
    private _options: BaseTokenProviderOptions;
    private _accessToken?: AccessToken;

    constructor(options: BaseTokenProviderOptions) {
        this._options = options;
    }

    public privateAxios(axiosOptions?: AxiosOptions): AxiosInstance {
        const customAxios = axios.create(axiosOptions?.config);

        customAxios.interceptors.request.use(async (options) => {
            await this.refreshAccessToken(axiosOptions?.issuer);
            if (!this._accessToken) console.warn('Refresh failed');

            if (options.headers && !options.headers['Authorization']) options.headers['Authorization'] = `Bearer ${this._accessToken?.raw}`;

            return options;
        });

        customAxios.interceptors.response.use(response => response, async (error) => {
            this.errorHandler(error);
        });

        return customAxios;
    }

    private async refreshAccessToken(issuer?: string): Promise<void> { }

    public async initialLogin(userCredentials: AuthRequest): Promise<AuthenticationState> {
        const response: Promise<AuthenticationState> = axios.post<AuthResponse>(`${this.authBaseUrl}/login`,
            { Email: userCredentials.Emai, Password: userCredentials.Password },
            { headers: { "Content-Type": "application/json" } }).then((res) => {
                const accessToken = this._options.decodeToken(res.data.token.token);
                if (!accessToken) return ({ status: AuthStatus.NOT_AUTHENTICATED, error: Error('No access token'), loading: false }) as AuthenticationState;

                this._accessToken = {
                    expires: accessToken.expires,
                    payload: this._options.decodeToken(res.data.token.token).payload,
                    raw: accessToken.raw
                }
                return {
                    timestamp: Date.now(),
                    axios: this.privateAxios(),
                    loading: false,
                    status: AuthStatus.AUTHENTICATED,
                    userInfo: {
                        userId: accessToken.payload.jti,
                        accountId: 'randmo-acc-id',
                        hasRoleFunction: (...anyOfRfn: string[]): boolean => {
                            const granted = new Set(Object.keys(accessToken.payload.roles));
                            return !!anyOfRfn.find((rfn) => granted.has(rfn));
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

    public errorHandler(error: any) {
        if ((error as AxiosError).isAxiosError) {
            switch (error.response?.status) {
                case 400:
                    this._options.setAuth({
                        failure: {
                            error: String(error.response.data.error ?? 'unauthorized'),
                            errorDescription: String(error.response.data.error_description),
                        },
                        status: AuthStatus.AUTHENTICATION_FAILED,
                    });
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
                    this._options.setAuth({
                        failure: {
                            error: 'forbidden',
                            errorDescription: error.response.statusText,
                        },
                        status: AuthStatus.AUTHENTICATION_FAILED, // Change to insufficient roles
                    });
                    return;
            }
        }
        this._options.setAuth({
            status: AuthStatus.NOT_AUTHENTICATED,
            loading: false,
            error: error
        });
    }
    public async logOut() {

    }
    public cleanUp() {

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