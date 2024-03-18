import { Injectable } from '@nestjs/common';
import { Message, Prisma, RESTRICTION, ROLE, TYPE } from '@prisma/client';
import Messages from 'src/gateway/types/Message.types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  // CREATECHATROOM
  async createChatRoom(body: {
    name: string;
    type: string;
    password?: string;
    creatorId: string;
  }) {
    try {
      console.log('CreatorId', body.creatorId);
      const user = await this.prismaService.user.findUnique({
        where: { id: body.creatorId },
      });
      console.log('User:', user);
      if (body.name === null || body.name === '')
        throw new Error('Chat room name cannot be empty');
      else if (
        body.type === 'PROTECTED' &&
        (body.password === null || body.password === '')
      )
        throw new Error('Password cannot be empty for protected chat room');

      const chatroom = await this.prismaService.chatroom.create({
        data: {
          name: body.name,
          password: body.password,
          chatroomType: body.type.toUpperCase() as TYPE,
          users: {
            create: {
              userId: user.id,
              role: 'CREATOR' as ROLE,
              restriction: 'NONE' as RESTRICTION,
            },
          },
        },
        include: {
          users: true,
        },
      });
      // this.setRoomOn(body.creatorId, chatroom.id);
      console.log('Chatroom created:', chatroom);
      return {
        id: chatroom.id,
        name: chatroom.name,
        roomType: chatroom.chatroomType,
        users: chatroom.users.map((chatroomUser) => chatroomUser.userId),
        messages: null,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return { error: 'Chat room name already exists' };
      }
      return { error: error.message }; // Remove the comma after error.message
    }
  }

  // GETPUBLICCHATROOMS
  async getPublicChatRooms() {
    const chatrooms = await this.prismaService.chatroom.findMany({
      where: {
        chatroomType: {
          in: ['PUBLIC', 'PROTECTED'],
        },
      },
      include: {
        users: true,
      },
    });
    return chatrooms.map((chatroom) => ({
      id: chatroom.id,
      name: chatroom.name,
      roomType: chatroom.chatroomType,
      users: chatroom.users.map((chatroomUser) => chatroomUser.userId),
      messages: null,
    }));
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
      const chatrooms = userWithChatrooms.chatRoomsIn.map(
        (chatroomUser) => chatroomUser.chatroom,
      );
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

  // JOINCHATROOM
  async joinChatRoom(body: {
    channelId: string;
    userId: string;
    password?: string;
  }) {
    try {
      const chatroom = await this.prismaService.chatroom.findUnique({
        where: { id: body.channelId },
        include: {
          users: true,
        },
      });
      if (!chatroom) {
        throw new Error('Chatroom not found');
      }
      if (chatroom.chatroomType === 'PROTECTED' && body.password !== null) {
        if (chatroom.password !== body.password)
          throw new Error('Invalid password');
        // check password for protected chatroom
      }

      // Check if user is already in chatroom
      const userInChatroom = chatroom.users.find(
        (chatroomUser) => chatroomUser.userId === body.userId,
      );
      if (userInChatroom) throw new Error('User is already in the chatroom');

      // Add user to chatroom
      await this.prismaService.chatroomUser.create({
        data: {
          role: 'MEMBER',
          restriction: 'NONE' as RESTRICTION,
          chatroom: {
            connect: {
              id: body.channelId,
            },
          },
          user: {
            connect: {
              id: body.userId,
            },
          },
        },
      });
      // const roomOn: {
      //   id: string;
      //   name: string;
      //   roomType: TYPE;
      //   users: string[];
      //   messages: Message | null;
      // } = {
      //   id: chatroom.id,
      //   name: chatroom.name,
      //   roomType: chatroom.chatroomType,
      //   users: chatroom.users.map((chatroomUser) => chatroomUser.userId),
      //   messages: null,
      // };
      // this.setRoomOn(body.userId, chatroom.id);
      return {
        id: chatroom.id,
        name: chatroom.name,
        roomType: chatroom.chatroomType,
        users: chatroom.users.map((chatroomUser) => chatroomUser.userId),
        messages: null,
      };
    } catch (error) {
      console.error('Error joining chatroom:', error);
      return { error: error.message };
    }
  }

  // SETROOMON
  // async setRoomOn(userId: string, roomId: string) {
  //   try {
  //     const user = await this.prismaService.user.update({
  //       where: { id: userId },
  //       data: {
  //         roomOnId: roomId,
  //       },
  //     });
  //     return user;
  //   } catch (error) {
  //     console.error('Error setting roomOn:', error);
  //     return { error: 'Error setting roomOn' };
  //   }
  // }

  // GETUSERNAMESFROMROOM
  async getUserNamesFromRoom(
    channelId: string,
  ): Promise<string[] | { error: string }> {
    try {
      const chatroom = await this.prismaService.chatroom.findUnique({
        where: { id: channelId },
        include: {
          users: {
            select: {
              user: { select: { name: true } }, // Sélectionnez seulement le nom de l'utilisateur
            },
          },
        },
      });
      // Vérifiez si la salle de discussion existe
      if (!chatroom) {
        throw new Error('Chatroom not found');
      }
      // Mappez les noms d'utilisateur à partir des données de chatroom
      const userNames = chatroom.users.map(
        (chatroomUser) => chatroomUser.user.name,
      );
      return userNames;
    } catch (error) {
      console.error('Error getting usernames from room:', error);
      return { error: 'Error getting usernames from room' };
    }
  }

  // ADDMESSAGE
  async addMessage(body: {
    message: {
      data: {
        id: string;
        content: string;
        chatId: string;
        emitter: string;
      };
    };
  }) {
    try {
      console.log('body', body);
      const newMessage: Message = await this.prismaService.message.create({
        data: {
          chat: {
            connect: {
              id: body.message.data.chatId,
            },
          },
          emitter: {
            connect: {
              id: body.message.data.emitter,
            },
          },
          content: body.message.data.content,
        },
      });
      // console.log('New message:', newMessage);
      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      return { error: 'Error adding message' };
    }
  }

  // GETCHATROOMBYID
  async getChatRoomById(channelId: string, userId: string) {
    try {
      const chatroom = await this.prismaService.chatroom.findUnique({
        where: { id: channelId },
        include: {
          users: true,
          messages: {
            include: {
              emitter: true,
            },
          },
        },
      });
      const user = await this.prismaService.chatroomUser.findFirst({
        where: { chatroomId: channelId, userId: userId },
      });
      const messages = await this.getMessagesFromRoom(channelId);
      return {
        chatroom: {
          id: chatroom.id,
          name: chatroom.name,
          roomType: chatroom.chatroomType,
          users: chatroom.users.map((chatroomUser) => chatroomUser.userId),
          messages: messages,
        },
        role: user.role as string,
      };
    } catch (error) {
      console.error('Error getting chatroom by id:', error);
      return { error: 'Error getting chatroom by id' };
    }
  }

  // GETMESSAGESFROMROOM
  async getMessagesFromRoom(roomId: string) {
    try {
      if (!roomId || roomId === '' || roomId === undefined) {
        return null;
      }
      const room = await this.prismaService.chatroom.findUnique({
        where: { id: roomId },
        include: {
          messages: {
            include: {
              emitter: true,
            },
          },
        },
      });
      const messages: Messages[] = room.messages.map((message) => ({
        id: message.id,
        content: message.content,
        chatId: message.chatId,
        emitterId: message.emitterId,
        emitterName: message.emitter.name, // Access the name from the emitter object
        emitterAvatar: message.emitter.avatar, // Access the avatar from the emitter object
      }));
      // console.log('Messages from room:', messages);
      return messages;
    } catch (error) {
      console.error('Error getting messages from room:', error);
      return { error: 'Error getting messages from room' };
    }
  }

  // GETPROFILESFROMROOM
  async getProfilesFromRoom(channelId: string) {
    try {
      const chatroom = await this.prismaService.chatroom.findUnique({
        where: { id: channelId },
        include: {
          users: {
            select: {
              user: true,
              role: true,
            },
          },
        },
      });
      const profiles: {
        userProfile: {
          id: string;
          name: string;
          imageSrc: string;
          gameHistory: any[];
        };
        role: string;
      }[] = chatroom.users.map((chatroomUser) => ({
        userProfile: {
          id: chatroomUser.user.id,
          name: chatroomUser.user.name,
          imageSrc: chatroomUser.user.avatar,
          gameHistory: [], // A CHANGER POUR PROFILE (recuperer les games du user)
        },
        role: chatroomUser.role,
      }));
      return profiles;
    } catch (error) {
      console.error('Error getting profiles from room:', error);
      return [];
    }
  }
}
