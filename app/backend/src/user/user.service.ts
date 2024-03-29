import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserData, UserInfo } from '../types/userInfo';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    // private authService: AuthService,
  ) {}

  async getUserInfo(userId: string, id: string) {
    const [me, user] = await Promise.all([
      this.findUserById(userId, UserData),
      this.prismaService.user.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          status: true,
          pong: {
            select: {
              victory: true,
              losses: true,
              rating: true,
            },
          },
        },
      }),
    ]);

    if (!me || !user) {
      throw new Error('User not found');
    }
    return user;
  }

  // UPDATEUSERNAME
  async updateUsername(body: { userId: string; newName: string }) {
    try {
      console.log('userId', body.userId);
      await this.prismaService.user.update({
        where: { id: body.userId },
        data: { name: body.newName },
      });
      console.log(
        (
          await this.prismaService.user.findUnique({
            where: { id: body.userId },
          })
        ).name,
      );
      return 'Username updated';
    } catch (error) {
      console.log(error);
      return 'Error !';
    }
  }

  // UPDATEAVATAR
  async updateAvatar(body: { userId: string; newAvatar: string }) {
    try {
      await this.prismaService.user.update({
        where: { id: body.userId },
        data: { avatar: body.newAvatar },
      });
      return 'Avatar updated';
    } catch (error) {
      console.log(error);
      return 'Error !';
    }
  }

  // GETUSERNAMEBYID
  async getUserNameById(body: { userId: string }) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: body.userId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user.name;
    } catch (error) {
      console.log(error);
      return 'Error getting username by id !';
    }
  }

  // GETPROFILEBYID
  async getProfileById(userId: string) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      return {
        id: user.id,
        name: user.name,
        imageSrc: user.avatar,
      };
    } catch (error) {
      console.log(error);
      return 'Error getting profile by id !';
    }
  }

  // LEAVECHATROOM
  async leaveChatroom(body: { userId: string; roomId: string }) {
    try {
      const usersInRoom = await this.prismaService.chatroom.findFirst({
        where: {
          id: body.roomId,
        },
        include: {
          users: true,
        },
      });
      const chatroomUser = await this.prismaService.chatroomUser.findFirst({
        where: { userId: body.userId, chatroomId: body.roomId },
      });

      if (chatroomUser) {
        await this.prismaService.chatroomUser.delete({
          where: {
            id: chatroomUser.id,
          },
        });
        if (usersInRoom.users.length === 0) {
          await this.prismaService.chatroom.delete({
            where: {
              id: chatroomUser.chatroomId,
            },
          });
        }
        return 'User left chatroom';
      }
    } catch (error) {
      console.log(error);
      return 'Error leaving chatroom';
    }
  }

  // GETFADEMENUINFOS
  async getFadeMenuInfos(userId: string, targetId: string, roomId: string) {
    try {
      // void roomId;
      let isBlocked: boolean;
      let isMuted: boolean;
      let isFriend: boolean;
      let role: string;

      if (!userId || !targetId) {
        return { error: 'User ID and target ID are required' };
      }
      // get user
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
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
      if (!user) {
        console.log('user not found (getFadeMenuInfo');
        return;
      }

      // check if user is friend
      if (user.friends.find((u) => u.id === targetId)) {
        isFriend = true;
      } else isFriend = false;

      // check if user is blocked
      if (user.blockedUsers.find((id) => id === targetId)) {
        isBlocked = true;
      } else isBlocked = false;

      // get chatroomUser
      const chatroomUser = await this.prismaService.chatroomUser.findFirst({
        where: {
          userId: targetId,
          chatroomId: roomId,
        },
      });
      if (!chatroomUser) {
        return {
          isFriend: isFriend,
          isConnected: false,
          isInvited: false,
          isBlocked: isBlocked,
          isMuted: false,
          isKicked: false,
          isBanned: false,
          role: '',
        };
      }

      // check if user is muted
      if (chatroomUser.restriction === 'MUTED') {
        isMuted = true;
      } else isMuted = false;
      if (chatroomUser.role) role = chatroomUser.role as string;
      else role = '';
      return {
        isFriend: isFriend,
        isConnected: false,
        isInvited: false,
        isBlocked: isBlocked,
        isMuted: isMuted,
        isKicked: false,
        isBanned: false,
        role: role,
      };
    } catch (error) {
      console.error('Error getting fade menu infos:', error);
      return { error: 'Error getting fade menu infos' };
    }
  }

  async findUserById(id: string, select: UserInfo) {
    return this.prismaService.user.findUnique({
      where: { id },
      select,
    });
  }

  // GETCHATROOMSIN
  async getChatRoomsIn(userId: string) {
    try {
      const userWithChatrooms = await this.prismaService.user.findUnique({
        where: { id: userId },
        include: {
          chatRoomsIn: {
            include: {
              chatroom: {
                include: {
                  users: true, // Include users in each chatroom
                  messages: true, // Include messages in each chatroom
                },
              },
            },
          },
        },
      });
      const chatrooms = userWithChatrooms.chatRoomsIn
        .filter((chatroom) => chatroom.chatroom.chatroomType !== 'DM')
        .map((chatroomUser) => chatroomUser.chatroom);
      return chatrooms.map((chatroom) => ({
        id: chatroom.id,
        name: chatroom.name,
        roomType: chatroom.chatroomType,
        users: chatroom.users.map((user) => user.id), // Map to user IDs
        messages: chatroom.messages, // Include messages
      }));
    } catch (error) {
      console.error('Error getting chatrooms for user:', error);
      return { error: 'Error getting chatrooms for user' };
    }
  }

  // GETCONNECTEDUSER
  async getConnectedUser(userId: string, token: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        include: {
          friends: true,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const friends = await Promise.all(
        user.friends.map(async (friend) => {
          const room = await this.prismaService.chatroom.findFirst({
            where: {
              chatroomType: 'DM',
              users: {
                every: {
                  OR: [{ userId: user.id }, { userId: friend.id }],
                },
              },
            },
          });
          let roomId = '';
          if (room) {
            console.log('ROOM FOUND -----_______-----___--_-', room);
            roomId = room.id;
          }
          return { id: friend.id, name: friend.name, roomId: roomId };
        }),
      );
      return {
        playerProfile: {
          id: user.id,
          name: user.name,
          imageSrc: user.avatar,
          games: [],
        },
        channelsIn: await this.getChatRoomsIn(userId),
        friends: friends,
        isConnected: user.status === 'ONLINE' ? true : false,
        isReadyLobby: false,
        access_token: token,
      };
    } catch (error) {
      console.log(error);
      return 'Error getting  connected user';
    }
  }

  // GETCHATMEMBERPROFILE
  async getChatMemberProfile(userId: string, targetId: string, roomId: string) {
    try {
      const chatroomUser = await this.prismaService.chatroomUser.findFirst({
        where: {
          userId: targetId,
          chatroomId: roomId,
        },
      });
      if (!chatroomUser) {
        throw new Error('Chatroom user not found');
      }
      const user = await this.prismaService.user.findUnique({
        where: { id: targetId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const userProfile = {
        id: user.id,
        name: user.name,
        imageSrc: user.avatar,
      };
      const role = chatroomUser.role as string;
      const fadeMenuInfos = await this.getFadeMenuInfos(
        userId,
        targetId,
        roomId,
      );
      return { userProfile, role, fadeMenuInfos };
    } catch (error) {
      console.error('Error getting chat member profile:', error);
      throw new Error('error getin chat member profile');
    }
  }
  // async getUserInfos(@Req() req: Request) {
  //   try {
  //     const token = this.authService.extractTokenFromHeader(req); // regler ca
  //     if (!token)
  //       throw new BadRequestException('authorization header not found');
  //     const decoded = this.authService.jwtService.decode(token);
  //     if (!decoded) throw new BadRequestException('invalid token');
  //     console.log(decoded);
  //     await this.prismaService.user.update({
  //       where: { id: decoded.id },
  //       data: { status: 'OFFLINE' },
  //     });
  //   } catch (error) {
  //     return { error: error.message };
  //   }
  // }

  // async getUserInfo(userId: string, id: string) {
  //   const [me, user] = await Promise.all([
  //     this.finUserById(userId, UserData),
  //     this.prismaService.user.findFirst({
  //       where: {
  //         id,
  //       },
  //       select: {
  //         id: true,
  //         name: true,
  //         status: true,
  //         pong: {
  //           select: {
  //             victory: true,
  //             losses: true,
  //             rating: true,
  //           },
  //         },
  //       },
  //     }),
  //   ]);

  //   if (!me || !user) {
  //     throw new Error('User not found');
  //   }
  //   return user;
  // }

  // async createUser(name: string, profile: Profile, select: UserInfo) {
  //   return await this.prismaService.user.create({
  //     data: {
  //       name,
  //       profile: {
  //         create: profile,
  //       },
  //       pong: {
  //         create: {},
  //       },
  //     },
  //     select,
  //   });
  // }

  // async getUserById(userId: string, select: UserInfo) {
  //   return await this.prismaService.user.findUnique({
  //     where: { id: userId },
  //     select,
  //   });
  // }

  // async findUserById(id: string, select: UserInfo) {
  //   return await this.prismaService.user.findUnique({
  //     where: { id },
  //     select,
  //   });
  // }

  // async findUserByname(name: string, select: UserInfo) {
  //   return await this.prismaService.user.findUnique({
  //     where: { name },
  //     select,
  //   });
  // }

  // async findManyUsers(ids: string[], select: UserInfo) {
  //   return await this.prismaService.user.findMany({
  //     where: {
  //       id: {
  //         in: ids,
  //       },
  //     },
  //     select,
  //   });
  // }

  //   async UpdateUserById(id: string, data: Partial<User>) {
  //     return this.prismaService.user.update({
  //       where: { id },
  //       data,
  //       include: {
  //         profile: {
  //           select: {
  //             lastname: true,
  //             firstname: true,
  //             avatar: true,
  //           },
  //         },
  //       },
  //     });
  //   }
}
