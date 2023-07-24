import {
    Body,
    Controller,
    FileTypeValidator, MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AuthLoginDto} from "./dto/auth-login.dto";
import {AuthRegisterDto} from "./dto/auth-register.dto";
import {AuthResetDto} from "./dto/auth-reset.dto";
import {AuthForgetDto} from "./dto/auth-forget.dto";
import {AuthService} from "./auth.service";
import {AuthMeDto} from "./dto/auth-me.dto";
import {AuthGuard} from "../guards/auth.guard";
import {User} from "../decorators/user.decorator";
import {FileFieldsInterceptor, FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {FileService} from "../file/file.service";

@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService, private readonly fileService: FileService) {
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

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(@User() user,
                      @UploadedFile(new ParseFilePipe({
                          validators: [
                              new FileTypeValidator({fileType: 'image/*'}),
                              new MaxFileSizeValidator({maxSize: 1024 * 42})
                          ]
                      })) photo: Express.Multer.File) {

        await this.fileService.upload(`photo-${user.id}.png`, photo)

        return {
            user,
            photo
        };
    }

    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async files(@User() user, @UploadedFiles() photo: Express.Multer.File[]) {


        return {
            user,
            photo
        };
    }

    @UseInterceptors(FileFieldsInterceptor([
        {
            name: 'photo',
            maxCount: 1,
        },
        {
            name: 'documents',
            maxCount: 10,
        }
    ]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async filesFields(@User() user, @UploadedFiles() files: {
        photo: Express.Multer.File,
        document: Express.Multer.File[]
    }) {


        return {
            files
        };
    }

}