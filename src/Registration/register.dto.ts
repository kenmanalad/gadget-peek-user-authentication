import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsIn } from "class-validator";

export class RegisterDTO {
    @IsEmail(
        {},
        {
            message: 'Error: Email Address must be in a valid email address format',
        }
    )
    @IsString(
        {
            message: 'Error: Email Address must not be longer than 16 characters',
        }
    )
    @IsNotEmpty(
        {
            message: 'Error: Email Address is required',
        }
    )
    emailAddress: string;

    @IsString()
    @MinLength(8)
    @MaxLength(16, 
        {
            message: 'Error: Password must not be longer than 16 characters',
        }
    )
    @IsNotEmpty(
        {
            message: 'Error: Password is required',
        }
    )
    //For manual registration password field must not be null/undefined/empty
    password: string

    @IsString(
        {
            message: 'Error: registerType must not be longer than 16 characters',
        }
    )
    @IsNotEmpty(
        {
            message: 'Error: Password is required',
        }
    )
    @IsIn(
        ['manual', 'oauth'], 
        {
            message: 'Error: registerType must be either "manual" or "oauth"',
        }
    )
    registerType: string
}