export interface RegisterUser {
    email: string
}

export interface LoginResponse {
    token: string
    user: any
}