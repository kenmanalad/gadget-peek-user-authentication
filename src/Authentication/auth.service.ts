import { Injectable } from "@nestjs/common";
import { AuthDTO } from "./auth.dto";
import { PrismaService } from "src/Prisma/prisma.service";
import { PasswordService } from "src/Common/Services/password.service";
import { stat } from "fs";
import { JwtService } from "@nestjs/jwt";



@Injectable({})
export class AuthService{
    constructor(
        private prismaService: PrismaService,
        private passwordService: PasswordService,
        private jwtService: JwtService
    ){}
    async manualSignin(signinDetails: AuthDTO){
        try{
            const transaction = await this.prismaService.$transaction(async(ts)=> {
                const verifiedUser = await ts.verifiedUser.findUnique({
                    where:{
                        emailAddress: signinDetails.emailAddress
                    }
                });

                if(!verifiedUser) return { user : null}

                return { user: verifiedUser};

            });
            if(!transaction.user){
                return {
                    //Error handlers is still an ongoing task
                    //Will be throwing an error in the next update
                    //This is just the initial way of handling errors
                    success: false,
                    message: "Error: User not yet verified, kindly register/verify account first.",
                    status: 404,
                    access_token: null
                }
            }
            const isValid = await this.passwordService.verifyPassword(signinDetails.password, transaction?.user?.password);
            console.log(isValid, "isvalidddddddd");
            if(!isValid){
                return{
                    //Error handlers is still an ongoing task
                    //Will be throwing an error in the next update
                    //This is just the initial way of handling errors
                    success: false,
                    message: "Error: Password is incorrect",
                    status: 401,
                    access_token: null
                }
            }

            let payload = { emailAddress: transaction?.user?.emailAddress, sub: transaction.user.id }

            return{
                    success: true,
                    message: "Signed in successfully",
                    status: 200,
                    access_token: await this.jwtService.signAsync(payload)
            }
        }catch(error){
            //Error handlers is still an ongoing task
            //Will be throwing an error in the next update
            //This is just the initial way of handling errors
            //Will be sending all errors to ADMIN Service
            console.error(error);
            return{
                    success: false,
                    message: "Error: Unexpected error occured, please contact an agent immediately",
                    status: 500,
                    access_token: null
                }
        }
    }
}