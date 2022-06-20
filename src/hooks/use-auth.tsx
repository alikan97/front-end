import { createContext, FC, useContext, useEffect, useState } from "react";
import { Auth, AuthenticationState, AuthRequest } from "../types/auth";
import { addRoleRequest } from "../types/requests/add-role-to-user";
import { registerRequest } from "../types/requests/register-user-dto";
import { globalAuthErrorHandler } from "../types/responses/authentication-error";
import { registerFailed, registerSuccess } from "../types/responses/registration-response";
import { AccessToken } from "../types/token";
import { ClientTokenProvider, decodeToken } from "../utilities/token";

export const AuthContext = createContext<Auth>({
    signIn: async() => {},
    signOut: async() => {},
    register: async() => {return Promise.resolve(undefined)},
    addRoleToUser: async() => {},
    error: undefined,
    state: undefined,
    loading: false,
});

export const AuthProvider:FC = ({ children }) => {
    const [state, setState] = useState<AuthenticationState | undefined>();
    const [error, setError] = useState<globalAuthErrorHandler>();
    const [provider, setProvider] = useState<ClientTokenProvider>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const provider = new ClientTokenProvider({
            logger: {
                ...console,
                verbose: (...args: any[]) => console.debug(args),
            },
            setError: (err: globalAuthErrorHandler) => setError(err),
            decodeToken: <T extends AccessToken>(raw: string) => decodeToken(raw) as T,
            setAuth: (authenticationState?:AuthenticationState) => setState(authenticationState),
        });

        setProvider(provider);
        return () => {
            provider.cleanup();
            setProvider(undefined);
        }
    }, []);

    const signIn = async (userCredentials: AuthRequest) => {
        setLoading(true);
        const auth = await provider?.initialLogin(userCredentials);
        setState(auth as AuthenticationState);
        setLoading(false);
    }

    const signOut = async() => {
        if (!provider) throw new Error('Must be signed in');
        provider.cleanup();
        provider.logOut();
        setState(undefined);
    }

    const register = async(request: registerRequest): Promise<registerSuccess | registerFailed> => {
        setLoading(true);
        const response = await provider?.register(request);
        if (!response) return {errors: {ErrorMsg: ["Failed to register"]}, status: 400, title: "Error"}
        setLoading(false);
        return response;
    }

    const addRoleToUser = async(request: addRoleRequest): Promise<void> => {
        await provider?.addRoleToUser(request);
        return;
    }

    return (
        <AuthContext.Provider value={{signIn, signOut, register, error, addRoleToUser, state, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthContext;