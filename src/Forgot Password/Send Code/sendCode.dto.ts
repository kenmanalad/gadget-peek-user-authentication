import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsIn } from "class-validator";

export class SendCodeDTO {
    @IsEmail(
        {},
        {
            message: 'Email Address must be in a valid email address format',
        }
    )
    @IsString(
        {
            message: 'Email Address must be a string',
        }
    )
    @IsNotEmpty(
        {
            message: 'Email Address is required',
        }
    )
    emailAddress: string;


}