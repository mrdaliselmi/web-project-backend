import { ConflictException, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    try {
      return this.userRepository.save(user);
    } catch (e) {
      throw new ConflictException('username or email already exists');
    }
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserByCredential(credential: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: [{ email: credential }, { username: credential }],
    });
  }
}
