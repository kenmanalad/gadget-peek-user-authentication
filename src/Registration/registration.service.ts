import { Injectable } from "@nestjs/common";

@Injectable({})
export class RegistrationService {

    register() {
        return {
            success: true,
            status: 200
        };
    }
}