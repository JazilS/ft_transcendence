import { Injectable } from '@nestjs/common';
import { Prisma, ROLE, TYPE } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}
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
      else if (body.type === 'PROTECTED' && body.password === null)
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
      messages: null};
    }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return { error: 'Chat room name already exists' };
      }
      return { error: 'test' };
    }
  }

  async getPublicChatRooms() {
    const chatrooms = await this.prismaService.chatroom.findMany({
      where: {
        chatroomType: 'PUBLIC',
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
}
