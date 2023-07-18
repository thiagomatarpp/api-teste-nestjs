import {Body, Controller, Delete, Get, Patch, Post, Put, UseGuards,} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdatePutUserDto} from './dto/update-put-user.dto';
import {UpdatePatchUserDto} from './dto/update-patch-user.dto';
import {UserService} from './user.service';
import {ParamId} from '../decorators/param-id.decorator';
import {RoleGuard} from "../guards/role.guard";
import {Roles} from "../decorators/roles.decorator";
import {Role} from "../enums/role.enum";
import {AuthGuard} from "../guards/auth.guard";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
    constructor(private readonly service: UserService) {
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.service.create(createUserDto);
    }

    @Get()
    async findAll() {
        return this.service.read();
    }

    @Get(':id')
    async readOne(@ParamId() id) {
        return this.service.readOne(id);
    }

    @Put(':id')
    async update(@ParamId() id, @Body() body: UpdatePutUserDto) {
        return this.service.update(id, body);
    }

    @Patch(':id')
    async partialUpdate(@ParamId() id, @Body() body: UpdatePatchUserDto) {
        return this.service.patch(id, body);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    async delete(@ParamId() id) {
        return this.service.delete(id);
    }
}
