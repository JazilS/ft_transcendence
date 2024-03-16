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
  @Post('getUserNameById')
  async getUserNameById(@Body() body: { userId: string }) {
    return this.userService.getUserNameById(body);
  }
  @Post('getProfileById')
  async getProfileById(@Body() body: { userId: string }) {
    return this.userService.getProfileById(body.userId);
  }
  @Post('leaveChatroom')
  async leaveChatroom(@Body() body: { userId: string; roomId: string }) {
    return this.userService.leaveChatroom(body);
  }
  @Post('/getFadeMenuInfos')
  async getFadeMenuInfos(
    @Body()
    body: {
      userId: string;
      targetId: string;
      roomId: string;
    },
  ) {
    return this.userService.getFadeMenuInfos(
      body.userId,
      body.targetId,
      body.roomId,
    );
  }
}
