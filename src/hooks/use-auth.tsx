import { createContext, FC, useContext, useEffect, useState } from "react";
import { Auth, AuthenticationState, AuthRequest } from "../types/auth";
import { registerRequest } from "../types/requests/register-user-dto";
import { registerFailed, registerSuccess } from "../types/responses/registration-response";
import { AccessToken } from "../types/token";
import { ClientTokenProvider, decodeToken } from "../utilities/token";

export const AuthContext = createContext<Auth>({
    signIn: async() => {},
    signOut: async() => {},
    register: async() => {return Promise.resolve(undefined)},
    state: undefined,
    loading: false,
});

export const AuthProvider:FC = ({ children }) => {
    const [state, setState] = useState<AuthenticationState | undefined>();
    const [provider, setProvider] = useState<ClientTokenProvider>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const provider = new ClientTokenProvider({
            logger: {
                ...console,
                verbose: (...args: any[]) => console.debug(args),
            },
            decodeToken: <T extends AccessToken>(raw: string) => decodeToken(raw) as T,
            setAuth: (authenticationState?:AuthenticationState) => setState(authenticationState),
        });

        setProvider(provider);

        return () => {
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
        provider.logOut();
        setState(undefined);
    }

    const register = async(request: registerRequest): Promise<registerSuccess | registerFailed> => {
        const response = await provider?.register(request);
        if (!response) return {errors: {ErrorMsg: ["Failed to register"]}, status: 400, title: "Error"}
        return response;
    }

    return (
        <AuthContext.Provider value={{signIn, signOut, register, state, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthContext;