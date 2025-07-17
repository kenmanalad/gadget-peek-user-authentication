import { Reflector } from "@nestjs/core";

const _Admin = Reflector.createDecorator<string>({
    key: "admin"
});

export const Admin = (value: string = "admin") => _Admin(value);