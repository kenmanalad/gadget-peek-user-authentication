import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsIn, IsNumber } from "class-validator";

export class VerifyDTO {
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

    @IsNumber(
        {},
        {
            message: 'Code must be a number',
        }
    )
    @IsNotEmpty(
        {
            message: 'Code is required',
        }
    )
    code: number
}