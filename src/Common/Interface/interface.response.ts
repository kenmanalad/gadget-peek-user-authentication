export interface BasicResponseInterface {
    success: boolean,
    message: string,
    status: number
}

export interface AuthenticationResponse extends BasicResponseInterface {
    emailAddress: string,
    userId: number
}