import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {PrismaService} from "../prisma/prisma.service";
import {users} from "@prisma/client";
import {AuthRegisterDto} from "./dto/auth-register.dto";
import {UserService} from "../user/user.service";
import {verifyPasswordHash} from "./password-utils";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {

    private
    private readonly issuer = 'login';
    private readonly audience = 'users';

    constructor(private readonly jwtService: JwtService,
                private readonly prisma: PrismaService,
                private readonly userService: UserService,
                private readonly mailer: MailerService) {
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

        if (!await verifyPasswordHash(password, user.password)) {
            throw new UnauthorizedException(`Email e/ou senha incorretos!`)
        }

        return this.createToken(user);
    }

    async forget(email: string) {
        const user = await this.prisma.users.findFirst({where: {email}});

        if (!user) {
            throw new NotFoundException(`Usuario ${email} não encontrado`)
        }

        const token = this.jwtService.sign({
            id: user.id
        }, {
            expiresIn: "30 minutes",
            subject: String(user.id),
            issuer: 'forget',
            audience: 'users'
        });

        await this.sendEmail('Recuperacao de senha', user, token);

        if (!user) {
            throw new UnauthorizedException(`Email incorreto`)
        }
        return true;
    }

    async reset(password: string, token: string) {
        try {
            const data: any = await this.jwtService.verify(token, {
                issuer: 'forget',
                audience: 'users'
            })

            this.checkTokenId(data.id);

            const hashedPassword = await this.userService.getPasswordHash(password)

            const user = await this.prisma.users.update({
                where: {id: Number(data.id)},
                data: {password: hashedPassword}
            });
            return this.createToken(user);

        } catch (e) {
            throw new BadRequestException(e)
        }


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

    private checkTokenId(data: any) {
        if (isNaN(Number(data))) {
            throw new BadRequestException("Invalid token");
        }
    }

    private async sendEmail(subject: string, user, token: string): Promise<void> {
        await this.mailer.sendMail({
            subject: subject,
            to: user.email,
            template: 'forget',
            context: {
                name: user.name,
                token: token
            }
        })
    }
}
