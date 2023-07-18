import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {PrismaService} from "../prisma/prisma.service";
import {users} from "@prisma/client";
import {AuthRegisterDto} from "./dto/auth-register.dto";
import {UserService} from "../user/user.service";
import {getPasswordHash, verifyPasswordHash} from "./password-utils";

@Injectable()
export class AuthService {

    private readonly issuer = 'login';
    private readonly audience = 'users';
    constructor(private readonly jwtService: JwtService,
                private readonly prisma: PrismaService,
                private readonly userService: UserService) {
    }

    async createToken(user: users) {
        const accessToken = this.jwtService.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, {
            expiresIn: '7 days',
            subject: String(user.id),
            issuer: this.issuer,
            audience: this.audience,

        });
        return {
            accessToken
        }
    }

    checkToken(token) {
        try {
            return this.jwtService.verify(token, {
                audience: this.audience,
                issuer: this.issuer
            })
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    async login(email: string, password: string) {
        const user = await this.prisma.users.findFirst({where: {email}});

        if (!user) {
            throw new UnauthorizedException(`Email e/ou senha incorretos!`)
        }

        if(!await verifyPasswordHash(password, user.password)){
            throw new UnauthorizedException(`Email e/ou senha incorretos!`)
        }

        return this.createToken(user);
    }

    async forget(email: string) {
        const user = await this.prisma.users.findFirst({where: {email}});
        if (!user) {
            throw new UnauthorizedException(`Email incorreto`)
        }
        return this.createToken(user);
    }

    async reset(password: string, token: string) {
        // todo validar o token
        const id = 0;
        const user = await this.prisma.users.update({where: {id}, data: {password}});
        return this.createToken(user);
    }

    async register(data: AuthRegisterDto) {
        const user = await this.userService.create(data);
        return this.createToken(user);
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        } catch (e) {
            return false;
        }

    }
}
