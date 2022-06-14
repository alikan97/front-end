export interface registerSuccess {
    roles: Array<string>,
    id: string,
}

export interface registerFailed {
    errors: Record<string, Array<string>>,
    status: number,
    title: string,
}