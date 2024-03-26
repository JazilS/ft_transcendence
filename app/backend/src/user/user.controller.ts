import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
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

  @Get('getConnectedUser')
  async getConnectedUser(@Headers('authorization') authorization: string) {
    const token: string = authorization.replace('Bearer ', '');
    console.log('getting into controller');

    try {
      const decodedToken = this.jwtService.decode(token);
      const userId = decodedToken.id;

      console.log('Decoded user ID in getConnectedUser:', userId);
      return this.userService.getConnectedUser(userId, token);
    } catch (error) {
      console.error('Invalid token');
      throw new BadRequestException('Invalid token');
    }
  }
  // @UseGuards(AuthGuard)
  // @Get('getUserInfos')
  // async getUserInfos(@Req() req: Request) {
  //   return await this.getUserInfos(req);
  // }
  //   constructor(private userService: UserService) {}
  //   @Get('userById')
  //   async getAllUsers(userId: string, id: string) {
  //     return this.userService.getUserInfo(userId, id);
  //   }
}
