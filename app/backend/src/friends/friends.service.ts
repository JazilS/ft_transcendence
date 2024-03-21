import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendsService {
    constructor(private readonly prismaService: PrismaService) {}

    private isInList(users: any, nickname: string): boolean {
        // Check if the given login exists in the users array
        const foundUser = users.find(user => user.nickname === nickname);
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

    private async   getUserInfoById(uid: string) {
        return await this.prismaService.user.findUnique({
            where: { id: uid, },
            select: {
              id: true,
              nickname: true,
              friends: {
                select: {
                  nickname: true,
                  id: true,
                  avatar: true,
                },
              },
              friendsRelation: {
                select: {
                  nickname: true,
                  id: true,
                  avatar: true,
                },
              },
            }
          });
    }

    private async   getUserInfoByName(nickname: string) {
        return await this.prismaService.user.findUnique({
            where: { nickname: nickname, },
            select: {
              id: true,
              nickname: true,
              friends: {
                select: {
                  nickname: true,
                  id: true,
                  avatar: true,
                },
              },
              friendsRelation: {
                select: {
                  nickname: true,
                  id: true,
                  avatar: true,
                },
              },
            }
          });
    }
    
    // const   user = await this.userService.getUserById(userId, { id: true, ...Object.fromEntries(Object.keys(user).map(key => [key, false])});

    async   addFriend(userId: string, friendNickname: string) {
        if (!userId || !friendNickname)
            return ({ success: false, message: 'user not found !'});

        const   user = await this.getUserInfoById(userId);
        const   friend = await this.getUserInfoByName(friendNickname);

        if (!user || !friend)
            return ({ success: false, message: 'user not found !'});
        if (user.nickname == friend.nickname)
            return ({ success: false, message: 'you can\'t add yourself dude!'});

        const   areFriend = this.isInList(user.friends, friend.nickname);
        if (areFriend)
            return ({ sucess: false, message: `${friend.nickname} is already your friend !` });

        await this.linkFriend(user, friend.id);
        await this.linkFriend(friend, userId);

        return ({ success: true, message: `${friend.nickname} is now your friend !` });       
    }

    async   removeFriend(userId: string, friendNickname: string) {
        const   user = await this.getUserInfoById(userId);
        const   friend = await this.getUserInfoByName(friendNickname);

        if (!user || !friend)
            return ({ success: false, message: 'user not found !'});
        if (user.nickname == friend.nickname)
            return ({ success: false, message: 'you can\'t remove yourself moron !'});
        
        const   areFriend = this.isInList(user.friends, friend.nickname);
        if (!areFriend)
            return ({ sucess: false, message: `${friend.nickname} is not even your friend !` });

        this.unlinkFriend(user, friend.id);
        this.unlinkFriend(friend, userId);
        
        return ({ success: true, message: `${friend.nickname} is no more your friend !` });       
    }

}
