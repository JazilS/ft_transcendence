import { Body, Controller, Post } from '@nestjs/common';
import { GetUser } from 'src/decorator/get.user.decorator';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
    constructor(private readonly FriendsService: FriendsService) {}

    @Post('add')
    async addFriend(@GetUser('id') userId: string, @Body('friend') friendId: string) {
        return await this.FriendsService.addFriend(userId, friendId);
    }
    
    @Post('remove')
    async removeFriend(@GetUser('id') userId: string, @Body('friend') friendId: string) {
        return await this.FriendsService.removeFriend(userId, friendId);
    }
}
