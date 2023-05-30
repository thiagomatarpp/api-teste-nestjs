import {
  IsDateString,
  IsEmail, IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import {Role} from "../../enums/role.enum";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minSymbols: 0,
    minUppercase: 0,
    minNumbers: 0,
    minLowercase: 0,
  })
  password: string;

  @IsOptional()
  @IsDateString()
  birthAt: string;

  @IsOptional()
  @IsEnum(Role)
  role: number;
}
