import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChangeEmailDTO{
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
    newEmailAddress: string;
    
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
    @Type(() => Number)
    code: number
}