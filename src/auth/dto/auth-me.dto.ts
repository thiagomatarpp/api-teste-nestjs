import {IsJWT, IsNotEmpty, IsString, MinLength} from "class-validator";

export class AuthMeDto {

    @IsString()
    @IsJWT()
    @IsNotEmpty()
    token: string;
}