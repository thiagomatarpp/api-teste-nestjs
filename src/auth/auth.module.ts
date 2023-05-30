import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {AuthController} from "./auth.controller";
import {PrismaModule} from "../prisma/prisma.module";
import {UserModule} from "../user/user.module";
import {AuthService} from "./auth.service";

@Module({
  imports: [
    JwtModule.register({
      secret: 'ExiuWwVeudVJ778zmWnrar97gMzcF3jv',
    }),
      PrismaModule,
      UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
