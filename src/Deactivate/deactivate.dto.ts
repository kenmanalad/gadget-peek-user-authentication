import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsIn, IsBoolean } from "class-validator";

export class DeactivateDTO {
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

    @IsString(
        {
            message: 'Error: Password must be a string',
        }
    )
    @MinLength(8,
        {
            message: 'Error: Password must not be less than 8 characters',
        }
    )
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
    password: string

    @IsBoolean(
        {
            message: 'Error: authType must be a string',
        }
    )
    @IsNotEmpty(
        {
            message: 'Error: isConfirmed is required',
        }
    )
    isConfirmed: boolean
}