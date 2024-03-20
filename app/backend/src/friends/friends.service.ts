import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendsService {
    constructor(private readonly prismaService: PrismaService,
                private readonly userService: UserService) {}

    private isInList(users: any, login: string): boolean {
        // Check if the given login exists in the users array
        const foundUser = users.find(user => user.login === login);
        return !!foundUser; // Return true if login exists, false otherwise
      }

    private async   linkFriend(user: any, friendId: string) {
        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                friends: {
                    connect: {
                        id: friendId
                    },
                },
            },
        });
    }

    private async   unlinkFriend(user: any, friendId: string) {
        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                friends: {
                    disconnect: {
                        id: friendId
                    },
                },
            },
        });
    }
    async   addFriend(userId: string, friendId: string) {
        const   user = await this.userService.getUserById(userId);
        const   friend = await this.userService.getUserById(userId);

        if (!user || !friend)
            return ({ success: false, message: 'user not found !'});
        if (user.nickname == friend.nickname)
            return ({ success: false, message: 'you can\'t add yourself dude!'});

        const   areFriend = this.isInList(user.friends, friend.nickname);
        if (areFriend)
            return ({ sucess: false, message: `${friend.nickname} is already your friend !` });

        await this.linkFriend(user, friendId);
        await this.linkFriend(friend, userId);

        return ({ success: true, message: `${friend.nickname} is now your friend !` });       
    }

    async   removeFriend(userId: string, friendId: string) {
        const   user = await this.userService.getUserById(userId);
        const   friend = await this.userService.getUserById(userId);

        if (!user || !friend)
            return ({ success: false, message: 'user not found !'});
        if (user.nickname == friend.nickname)
            return ({ success: false, message: 'you can\'t remove yourself moron !'});
        
        const   areFriend = this.isInList(user.friends, friend.nickname);
        if (!areFriend)
            return ({ sucess: false, message: `${friend.nickname} is not even your friend !` });
    

    }

}
