import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NodeMailerService } from "src/Common/Services/NodeMailer/nodemailer.service";
import { PrismaService } from "src/Common/Services/Prisma/prisma.service";
import { SendCodeDTO } from "./sendCode.dto";
import { randomInt } from "crypto";
import { forgotPasswordEmail } from "src/Email Template/forgot.password.template";
import { ConfigService } from "@nestjs/config";
import { MetaResponseService } from "src/Common/Services/Utils/meta.response.service";

@Injectable()
export class SendCodeService {
    constructor(
        private prismaService: PrismaService,
        private nodeMailerService: NodeMailerService,
        private metaService: MetaResponseService
    ){}

    async sendCode(userCredentials: SendCodeDTO){
        const code = randomInt(100000, 1000000);
        const now = Date.now();

        const user = await this.prismaService.verifiedUser.findFirst({
            where: {
                emailAddress: userCredentials.emailAddress
            }
        });

        if(!user) throw new BadRequestException('The email address is not registered/verified. Please submit a verified email address');

        const htmlFormat = forgotPasswordEmail(code);

        const forgotPasswordDetails = await this.prismaService.forgetPassword.findFirst({
            where:{
                emailAddress: user.emailAddress
            }
        });

        if(forgotPasswordDetails){
            if(now < forgotPasswordDetails.reset.getTime()) throw new HttpException('Please wait 1 minute before requesting a new code.', HttpStatus.TOO_MANY_REQUESTS,);
            
            await this.prismaService.forgetPassword.update({
                data: {
                    code: code,
                    codeExpiration: new Date(now + 15 * 60 * 1000),
                    reset: new Date(now + 1 * 60 * 1000)
                },
                where: {
                    id: forgotPasswordDetails.id
                }
            });
        }else{
            await this.prismaService.forgetPassword.create({
                data: {
                    emailAddress: user.emailAddress,
                    code: code,
                    codeExpiration: new Date(now + 15 * 60 * 1000),
                    reset: new Date(now + 1 * 60 * 1000)
                },
                
            });
        }


        // sendCode throws if sending the email fails
        await this.nodeMailerService.sendCode(user.emailAddress, code, 'Forgot Password Code', htmlFormat);

        const meta = this.metaService.meta();
        return {
            success: true,
            message: "Forgot Password Code Sent Successfully. Please check your email.",
            meta
        }

    }
}