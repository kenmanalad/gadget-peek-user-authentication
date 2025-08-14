import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsIn, IsNumber } from "class-validator";

export class ChangePasswordDTO {
    @IsString(
        {
            message: 'Token must be a string',
        }
    )
    @IsNotEmpty(
        {
            message: 'Token is required',
        }
    )
    token: string;
    
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
    newPassword: string;



}