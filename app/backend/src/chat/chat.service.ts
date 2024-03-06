import { Injectable } from '@nestjs/common';
import { Prisma, ROLE, TYPE } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  // CREATECHATROOM
  async createChatRoom(body: {
    name: string;
    type: string;
    password?: string;
    creator: string;
  }) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: body.creator },
      });
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
            },
          },
        },
        include: {
          users: true,
        },
      });
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
      return { error: 'error creating chatroom' };
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
}