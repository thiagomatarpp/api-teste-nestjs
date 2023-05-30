import {IsString, MinLength} from "class-validator";

export class AuthForgetDto {
    @IsString()
    @MinLength(6)
    email: string;
}