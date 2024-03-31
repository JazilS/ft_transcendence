import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/decorator/get.user.decorator';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('updateUsername')
  async updateUsername(@Body() body: { userId: string; newName: string }) {
    return await this.userService.updateUsername(body);
  }

  @UseGuards(AuthGuard)
  @Post('updateAvatar')
  async updateAvatar(@Body() body: { userId: string; newAvatar: string }) {
    return await this.userService.updateAvatar(body);
  }

  @UseGuards(AuthGuard)
  @Post('getUserNameById')
  async getUserNameById(@Body() body: { userId: string }) {
    return await this.userService.getUserNameById(body);
  }

  @UseGuards(AuthGuard)
  @Post('getUserIdByName')
  async getUserIdByName(@Body() body: { userName: string }) {
    return await this.userService.getUserIdByName(body);
  }

  @UseGuards(AuthGuard)
  @Post('getProfileById')
  async getProfileById(@Body() body: { userId: string }) {
    return await this.userService.getProfileById(body.userId);
  }

  @UseGuards(AuthGuard)
  @Post('getProfileByName')
  async getProfileByName(@Body() body: { userName: string }) {
    return await this.userService.getProfileByName(body.userName);
  }

  @UseGuards(AuthGuard)
  @Post('leaveChatroom')
  async leaveChatroom(@Body() body: { userId: string; roomId: string }) {
    return await this.userService.leaveChatroom(body);
  }

  @UseGuards(AuthGuard)
  @Post('/getFadeMenuInfos')
  async getFadeMenuInfos(
    @Body()
    body: {
      userId: string;
      targetId: string;
      roomId: string;
    },
  ) {
    return await this.userService.getFadeMenuInfos(
      body.userId,
      body.targetId,
      body.roomId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('getConnectedUser')
  async getConnectedUser(
    @GetUser('id') userId: string,
    @Headers('authorization') authorization: string,
  ) {
    const token: string = authorization.replace('Bearer ', '');
    return await this.userService.getConnectedUser(userId, token);
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
