import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/decorator/get.user.decorator';
import { FriendsService } from './friends.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(AuthGuard)
  @Post('add')
  async addFriend(
    @GetUser('id') userId: string,
    @Body('friend') friend: string,
  ) {
    console.log('addFriend', userId, friend);
    return await this.friendsService.addFriend(userId, friend);
  }

  @UseGuards(AuthGuard)
  @Post('remove')
  async removeFriend(
    @GetUser('id') userId: string,
    @Body('friend') friend: string,
  ) {
    return await this.friendsService.removeFriend(userId, friend);
  }
}
