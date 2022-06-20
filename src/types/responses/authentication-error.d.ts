import { AxiosError } from "axios";

export interface errorType {
    errors: Record<string, Array<string>>,
    status: number,
    title: string,
}

export type globalAuthErrorHandler = AxiosError<errorType, any>;