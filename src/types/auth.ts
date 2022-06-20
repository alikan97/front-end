import { AxiosInstance, AxiosRequestConfig } from "axios";
import { addRoleRequest } from "./requests/add-role-to-user";
import { registerRequest } from "./requests/register-user-dto";
import { globalAuthErrorHandler } from "./responses/authentication-error";
import { registerFailed, registerSuccess } from "./responses/registration-response";

export const FORWARDED_AUTHORIZATION = 'x-forwarded-authorization';

export enum AuthStatus {
  AUTHENTICATED = "Authenticated",
  CONFIG_ERROR = "Failed-Config",
  AUTHENTICATION_FAILED = "Authentication-Failed",
  NOT_AUTHENTICATED = "Not-Authenticated"
}

export interface Auth {
  signIn: (userCredentials: AuthRequest) => Promise<void>;
  signOut: () => Promise<void>;
  register: (request: registerRequest) => Promise<registerSuccess | registerFailed | undefined>,
  addRoleToUser: (req: addRoleRequest) => Promise<void>;
  error: globalAuthErrorHandler | undefined,
  state: AuthenticationState | undefined;
  loading: boolean;
}

export type AuthenticationState = AuthenticatedState | AuthenticationFailedState | NotAuthenticatedState;

export interface AuthenticatedState {
  status: AuthStatus.AUTHENTICATED,
  loading: boolean,
  timestamp: number,
  axios: AxiosInstance,
  userInfo: UserInfo,
  error?: Error
}

export interface UserInfo {
  userId: string,
  userName: string,
  userEmail: string,
  accountId: string,
  hasRoleFunction: (...anyOfRfn: string[]) => boolean;
}

export interface AuthenticationFailedState {
  status: AuthStatus.AUTHENTICATION_FAILED;
  failure: AuthenticationFailure;
}

export interface AuthenticationFailure {
  error: string;
  errorDescription: string;
}

export interface NotAuthenticatedState {
  status: AuthStatus.NOT_AUTHENTICATED;
  loading: boolean;
  error?: Error;
}

export interface AxiosOptions {
  issuer?: string;
  config?: AxiosRequestConfig;
}

export interface AuthRequest {
  Emai: string;
  Password: string;
}