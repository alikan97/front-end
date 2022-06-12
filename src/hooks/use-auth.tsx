import { createContext, FC, useContext, useEffect, useState } from "react";
import { Auth, AuthenticationState, AuthRequest } from "../types/auth";
import { AccessToken } from "../types/token";
import { ClientTokenProvider, decodeToken } from "../utilities/token";

export const AuthContext = createContext<Auth>({
    signIn: async() => {},
    signOut: async() => {},
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

    return (
        <AuthContext.Provider value={{signIn, signOut, state, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthContext;