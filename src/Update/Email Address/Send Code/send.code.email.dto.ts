import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendCodeUpdateEmailDTO{
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