import {Body, Controller, Post, Req, UseGuards} from "@nestjs/common";
import {AuthLoginDto} from "./dto/auth-login.dto";
import {AuthRegisterDto} from "./dto/auth-register.dto";
import {AuthResetDto} from "./dto/auth-reset.dto";
import {AuthForgetDto} from "./dto/auth-forget.dto";
import {AuthService} from "./auth.service";
import {AuthMeDto} from "./dto/auth-me.dto";
import {AuthGuard} from "../guards/auth.guard";
import {User} from "../decorators/user.decorator";

@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService) {
    }

    @Post('login')
    async login(@Body() {email, password}: AuthLoginDto) {
        return this.service.login(email, password);
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDto) {
        return this.service.register(body);
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDto) {
        return this.service.forget(email);
    }

    @Post('reset')
    async reset(@Body() {password, token}: AuthResetDto) {
        return this.service.reset(password, token)
    }

    @Post('valid')
    async isValidToken(@Body() body: AuthMeDto) {
        return this.service.isValidToken(body.token)
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User('email') user) {
        return {
            user: user
        };
    }
}