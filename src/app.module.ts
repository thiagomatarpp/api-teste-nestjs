import {forwardRef, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import {AuthModule} from "./auth/auth.module";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {ConfigModule} from "@nestjs/config";
import {FileModule} from './file/file.module';
import {PugAdapter} from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import {MailerModule} from "@nestjs-modules/mailer";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'hettie.gislason@ethereal.email',
                    pass: 'EhuuXPGzUMmeKrEmJA'
                }
            },
            defaults: {
                from: '"Api Teste" <hettie.gislason@ethereal.email>',
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 100
        }),
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
        FileModule,
    ],
    controllers: [AppController],
    providers: [AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }],
})
export class AppModule {
}
