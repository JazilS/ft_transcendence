import { Injectable } from '@nestjs/common';
import { TYPE } from '@prisma/client';
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
    await this.prismaService.chatroom.create({
      data: {
        name: body.name,
        chatroomType: body.type.toUpperCase() as TYPE,
      },
    });
    return { message: 'Chat room created' };
  }
}
