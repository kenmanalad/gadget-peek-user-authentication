import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GoogleDTO {
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

    @IsString(
        {
            message: 'Code must be a string',
        }
    )
    @IsNotEmpty(
        {
            message: 'Code is required',
        }
    )
    code: string
}