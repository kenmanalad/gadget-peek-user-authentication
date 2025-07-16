import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsIn } from "class-validator";

export class RefreshTokenDTO {
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
            message: 'Error: Refresh Token must be a string',
        }
    )
    @IsNotEmpty(
        {
            message: 'Error: Refresh Token is required',
        }
    )
    refreshToken: string

}