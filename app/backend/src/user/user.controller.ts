import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('userById')
  async getAllUsers(userId: string, id: string) {
    return this.userService.getUserInfo(userId, id);
  }
}
