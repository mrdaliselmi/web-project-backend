import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('wishlist')
  wishlist(@User() user) {
    return this.userService.getWishlist(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('wishlist/:id')
  addToWishlist(@Param('id') id: string, @User() user) {
    return this.userService.addToWishList(+id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('wishlist/:id')
  removeFromWishlist(@Param('id') id: string, @User() user) {
    return this.userService.removeFromWishlist(+id, user);
  }
  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@User() user, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@User() user) {
    return this.userService.remove(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@User() user) {
    return this.userService.getProfile(user);
  }
}
