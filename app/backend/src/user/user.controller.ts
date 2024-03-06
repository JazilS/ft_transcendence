import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('register')
  async register() {
    return this.userService.register();
  }
  @Post('updateUsername')
  async updateUsername(@Body() body: { userId: string; newName: string }) {
    return this.userService.updateUsername(body);
  }
  @Post('updateAvatar')
  async updateAvatar(@Body() body: { userId: string; newAvatar: string }) {
    return this.userService.updateAvatar(body);
  }
}