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


export interface UnverifiedUserInterface {
    id: number
    emailAddress: string,
    password: string,
    userType: string,
    code: number,
    createdAt: Date
}

export interface MailOptionInterface {
    text: string, 
    emailAddress: string, 
    html: string
}

export interface SignInInterface{
    emailAddress: string,
    password: string,
    authType: "manual" | "oauth"
}