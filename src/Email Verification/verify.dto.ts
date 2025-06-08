import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsIn, IsNumber } from "class-validator";

export class VerifyDTO {
    @IsEmail(
        {},
        {
            message: 'Error: Email Address must be in a valid email address format',
        }
    )
    @IsString(
        {
            message: 'Error: Email Address must be a string',
        }
    )
    @IsNotEmpty(
        {
            message: 'Error: Email Address is required',
        }
    )
    emailAddress: string;

    @IsNumber(
        {},
        {
            message: 'Error: Code must be a number',
        }
    )
    @IsNotEmpty(
        {
            message: 'Error: Code is required',
        }
    )
    code: number
}