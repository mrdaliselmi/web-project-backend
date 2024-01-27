import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dtos/register-use.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(registerData: RegisterUserDto) {
    const { username, email, password } = registerData;
    const user = new UserEntity();
    user.email = email;
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    const result = await this.userService.create(user);
    return {
      id: result.id,
      username: result.username,
      email: result.email,
    };
  }
  async signIn(loginData: SignInDto) {
    const { email, password } = loginData;
    const user = await this.userService.findUserByCredential(email);

    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (user && hashedPassword === user.password) {
      const payload = { username: user.username, id: user.id };
      return {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
