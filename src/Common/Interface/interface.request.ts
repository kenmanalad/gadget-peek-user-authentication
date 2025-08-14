export interface ManualUserDetailsInterface {
    emailAddress: string,
    password: string
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


export interface RequestUserInterface {
    emailAddress: string,
    sub: number,
    role: string
}