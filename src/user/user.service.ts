import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdatePutUserDto} from './dto/update-put-user.dto';
import {UpdatePatchUserDto} from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {
    }

    async create(data: CreateUserDto) {
        data.password = await this.getPasswordHash(data.password);
        return this.prisma.users.create({
            data,
        });
    }

    async readOne(id: number) {
        const response = await this.prisma.users.findUnique({
            where: {id},
        });
        if (!response) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return response;
    }

    async read() {
        return this.prisma.users.findMany();
    }

    async delete(id) {
        await this.readOne(id);
        this.prisma.users.delete({where: {id}});
    }

    async update(id, data: UpdatePutUserDto) {
        await this.readOne(id);

        const {password} = data;

        if (password) {
            data.password = await this.getPasswordHash(password);
        }

        return this.prisma.users.update({
            data,
            where: {id},
        });
    }

    async patch(id, data: UpdatePatchUserDto) {
        await this.readOne(id);

        const {password} = data;

        if (password) {
            data.password = await this.getPasswordHash(password);
        }

        return this.prisma.users.update({
            data,
            where: {id},
        });
    }

    public async getPasswordHash(password: string) {
        return await bcrypt.hash(password, await bcrypt.genSalt());
    }
}
