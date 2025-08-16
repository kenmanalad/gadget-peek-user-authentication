import { IsNotEmpty, IsString } from "class-validator"

export class PasswordUpdateDTO{
    @IsString({
        message: "The Old Password you submitted is invalid. Please submit your registered password."
    })
    @IsNotEmpty({
        message: "Your Old Password is required to access this service. Please submit your registered passowrd."
    })
    oldPassword: string


    @IsString({
        message: "The New Password you submitted is invalid. Please submit a valid new password."
    })
    @IsNotEmpty({
        message: "A New Password is required to access this service. Please a valid new password."
    })
    newPassword: string
}