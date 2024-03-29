import { ConflictException, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerProduct } from 'src/customer-product/entities/customer-product.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CustomerProduct)
    private readonly cpRepository: Repository<CustomerProduct>,
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

  async addToWishList(id: number, user: any) {
    const currentEntry = await this.cpRepository.findOne({
      where: { user: { id: user.id }, product: { id: id } },
    });
    if (currentEntry) {
      if (currentEntry.wishlisted) {
        return { message: 'Already in Wishlist!' };
      }
      await this.cpRepository.update(currentEntry.id, { wishlisted: true });
    } else {
      await this.cpRepository.save({
        product: { id: id },
        user: { id: user.id },
        wishlisted: true,
      });
    }
    return { message: 'Added to Wishlist Successfully!' };
  }

  async removeFromWishlist(id: number, user: any) {
    const currentEntry = await this.cpRepository.findOne({
      where: { user: { id: user.id }, product: { id: id } },
    });
    if (currentEntry) {
      await this.cpRepository.update(currentEntry.id, { wishlisted: false });
      return { message: 'Removed from wishlist successfully!' };
    }
    return { message: 'Product not found in wishlist!' };
  }

  async getWishlist(user: any) {
    const products = await this.cpRepository
      .createQueryBuilder('cp')
      .innerJoinAndSelect('cp.product', 'product')
      .where('cp.user.id = :userId', { userId: user.id })
      .andWhere('cp.wishlisted = 1')
      .getMany();

    const results = await products.map((product) => {
      return product.product;
    });
    results.forEach((result) => {
      result.images = JSON.parse(result.images);
      result.colors = JSON.parse(result.colors);
    });
    return { data: results };
  }

  async getProfile(user: any) {
    const currentUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    return {
      data: { email: currentUser.email, username: currentUser.username },
    };
  }

  async update(user, updateUser: UpdateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (updateUser.email && updateUser.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUser.email },
      });

      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('Email already exists');
      }
      user.email = updateUser.email;
    }
    if (updateUser.username && updateUser.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUser.username },
      });
      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('Username already exists');
      }
      user.username = updateUser.username;
    }
    if (updateUser.password) {
      user.salt = existingUser.salt;
      user.password = await bcrypt.hash(updateUser.password, user.salt);
    }
    this.userRepository.save(user);
    return { message: 'User updated successfully!' };
  }

  async remove(user) {
    await this.userRepository.softDelete(user.id);
    return { message: 'User removed' };
  }
}
