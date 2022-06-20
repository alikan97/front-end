import { AuthenticationState } from "./auth";
import { globalAuthErrorHandler } from "./responses/authentication-error";

export interface RawTokenSet {
    refreshToken: string;
    accessToken: string;
}
export interface TokenProviderLogger {
    verbose: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
}

export interface Token {
    expires: number;
    token: string;
    refreshToken: string;
}

export interface AuthResponse {
    token: Token;
    success: boolean;
    statusCode: number;
    errorContent: string;
}

export interface AccessToken {
    expires: number;
    refreshToken: string;
    payload: AccessTokenPayload;
    raw: string;
}

export interface AccessTokenPayload {
    aud: string;
    exp: number;
    iss: string;
    name: string;
    email: string;
    jti: string;
    nbf: number;
    iat: number;
    roles: string[];
}

export interface BaseTokenProviderOptions {
    logger?: TokenProviderLogger;
    setError: (err: globalAuthErrorHandler) => void,
    setAuth: (authenticationState?: AuthenticationState) => void;
    decodeToken: <T extends AccessToken>(raw: string) => T;
}