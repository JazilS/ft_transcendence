import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/decorator/get.user.decorator';
import { FriendsService } from './friends.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('friends')
export class FriendsController {
    constructor(private readonly FriendsService: FriendsService) {}

    @UseGuards(AuthGuard)
    @Post('add')
    async addFriend(@GetUser('id') userId: string, @Body('friend') friendId: string) {
        return await this.FriendsService.addFriend(userId, friendId);
    }
    
    @UseGuards(AuthGuard)
    @Post('remove')
    async removeFriend(@GetUser('id') userId: string, @Body('friend') friendId: string) {
        return await this.FriendsService.removeFriend(userId, friendId);
    }
}
