import { IsEmail, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;
  @MaxLength(20)
  username: string;

  password: string;
}