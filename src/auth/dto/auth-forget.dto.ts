import {IsEmail, MinLength} from "class-validator";

export class AuthForgetDto {
    @IsEmail()
    @MinLength(6)
    email: string;
}