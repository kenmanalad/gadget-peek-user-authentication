import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MetaResponseService{
    constructor(
        private configService: ConfigService
    ){}

    meta(){
        const apiVersion = this.configService.get<number>('API_VERSION') ?? 1.0;
        return {
            timestamp: new Date().toISOString(),
            apiVersion
        }
    }
}