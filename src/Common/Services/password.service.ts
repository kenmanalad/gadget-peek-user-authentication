import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt"

@Injectable({})
export class PasswordService{
    async hashPassword(password: string): Promise<string>{
        const salt = 10;
        return await bcrypt.hash(password,10);    
    }

    async verifyPassword(password: string, hashedPassword: string) :Promise<boolean>{
        return bcrypt.compare(password, hashedPassword);
    }
}