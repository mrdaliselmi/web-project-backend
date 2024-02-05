import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;
  @MaxLength(20)
  username: string;
  @MinLength(6)
  password: string;
}