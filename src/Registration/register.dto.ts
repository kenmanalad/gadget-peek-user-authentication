import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsIn } from "class-validator";

export class RegisterDTO {
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
            message: 'Password must be a string',
        }
    )
    @MinLength(8,
        {
            message: 'Password must not be less than 8 characters',
        }
    )
    @MaxLength(16, 
        {
            message: 'Password must not be longer than 16 characters',
        }
    )
    @IsNotEmpty(
        {
            message: 'Password is required',
        }
    )
    //For manual registration password field must not be null/undefined/empty
    password: string
}