import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt"

@Injectable({})
export class CryptService{
    async hashData(password: string): Promise<string>{
        const salt = 10;
        return await bcrypt.hash(password,10);    
    }

    async verifyData(password: string, hashedPassword: string) :Promise<boolean>{
        return await bcrypt.compare(password, hashedPassword);
    }
}