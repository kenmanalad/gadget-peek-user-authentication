export interface ManualUserDetailsInterface {
    emailAddress: string,
    password: string,
    userType: string
}

export interface EmailDetailsInterface {
    from: {
        name: string,
        address:string
    },
    to: string,
    subject: string,
    text: string,
    html:string
}