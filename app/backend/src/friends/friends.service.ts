import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prismaService: PrismaService) {}

  private isInList(
    users: {
      id: string;
      name: string;
      avatar: string;
    }[],
    id: string,
  ): boolean {
    // Check if the given login exists in the users array
    const foundUser = users.find((user) => user.id === id);
    return !!foundUser; // Return true if login exists, false otherwise
  }

  private async linkFriend(user: any, friendId: string) {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        friends: {
          connect: {
            id: friendId,
          },
        },
      },
    });
  }

  private async unlinkFriend(user: any, friendId: string) {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        friends: {
          disconnect: {
            id: friendId,
          },
        },
      },
    });
  }

  private async getUserInfoById(uid: string) {
    return await this.prismaService.user.findUnique({
      where: { id: uid },
      select: {
        id: true,
        name: true,
        blockedByUsers: true,
        blockedUsers: true,
        friends: {
          select: {
            name: true,
            id: true,
            avatar: true,
          },
        },
        friendsRelation: {
          select: {
            name: true,
            id: true,
            avatar: true,
          },
        },
      },
    });
  }

  private async getUserInfoByName(name: string) {
    return await this.prismaService.user.findUnique({
      // where: { id: '123' }, // to revert
      where: { name: name },
      select: {
        id: true,
        name: true,
        friends: {
          select: {
            name: true,
            id: true,
            avatar: true,
          },
        },
        friendsRelation: {
          select: {
            name: true,
            id: true,
            avatar: true,
          },
        },
      },
    });
  }

  // add friend by id
  async addFriend(userId: string, friendId: string) {
    console.log('addFriend SERVICE -------------------', userId, friendId);
    if (!userId || !friendId)
      return { success: false, message: 'user not found !' };

    const user = await this.getUserInfoById(userId);
    const friend = await this.getUserInfoById(friendId);

    if (!user || !friend)
      return { success: false, message: 'user not found !' };
    if (user.id == friend.id)
      return { success: false, message: "you can't add yourself dude!" };

    const areFriend = this.isInList(user.friends, friend.id);
    const isBlocked = user.blockedByUsers.includes(friend.id);

    if (areFriend)
      return {
        sucess: false,
        message: `${friend.name} is already your friend !`,
      };

    if (isBlocked)
      return {
        sucess: false,
        message: `you can't add ${friend.name} as friend, you are blocked by him !`,
      };

    await this.linkFriend(user, friend.id);
    await this.linkFriend(friend, userId);

    return { success: true, message: `${friend.name} is now your friend !` };
  }

  // remove friend by id
  async removeFriend(userId: string, friendId: string) {
    const user = await this.getUserInfoById(userId);
    const friend = await this.getUserInfoById(friendId);

    if (!user || !friend)
      return { success: false, message: 'user not found !' };
    if (user.name == friend.name)
      return { success: false, message: "you can't remove yourself moron !" };

    const areFriend = this.isInList(user.friends, friend.id);
    if (!areFriend)
      return {
        sucess: false,
        message: `${friend.name} is not even your friend !`,
      };

    this.unlinkFriend(user, friend.id);
    this.unlinkFriend(friend, userId);

    return {
      success: true,
      message: `${friend.name} is no more your friend !`,
    };
  }

  // const   user = await this.userService.getUserById(userId, { id: true, ...Object.fromEntries(Object.keys(user).map(key => [key, false])});

  // async addFriend(userId: string, friendname: string) {
  //   console.log('addFriend SERVICE -------------------', userId, friendname);
  //   if (!userId || !friendname)
  //     return { success: false, message: 'user not found !' };

  //   const user = await this.getUserInfoById(userId);
  //   const friend = await this.getUserInfoByName(friendname);

  //   if (!user || !friend)
  //     return { success: false, message: 'user not found !' };
  //   if (user.name == friend.name)
  //     return { success: false, message: "you can't add yourself dude!" };

  //   const areFriend = this.isInList(user.friends, friend.name);
  //   const isBlocked = user.blockedByUsers.includes(friend.name);

  //   if (areFriend)
  //     return {
  //       sucess: false,
  //       message: `${friend.name} is already your friend !`,
  //     };

  //   if (isBlocked)
  //     return {
  //       sucess: false,
  //       message: `you can't add ${friend.name} as friend, you are blocked by him !`,
  //     };

  //   await this.linkFriend(user, friend.id);
  //   await this.linkFriend(friend, userId);

  //   return { success: true, message: `${friend.name} is now your friend !` };
  // }

  // async removeFriend(userId: string, friendname: string) {
  //   const user = await this.getUserInfoById(userId);
  //   const friend = await this.getUserInfoByName(friendname);

  //   if (!user || !friend)
  //     return { success: false, message: 'user not found !' };
  //   if (user.name == friend.name)
  //     return { success: false, message: "you can't remove yourself moron !" };

  //   const areFriend = this.isInList(user.friends, friend.name);
  //   if (!areFriend)
  //     return {
  //       sucess: false,
  //       message: `${friend.name} is not even your friend !`,
  //     };

  //   this.unlinkFriend(user, friend.id);
  //   this.unlinkFriend(friend, userId);

  //   return {
  //     success: true,
  //     message: `${friend.name} is no more your friend !`,
  //   };
  // }
}
