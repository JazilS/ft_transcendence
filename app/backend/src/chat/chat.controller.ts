import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Post('/createChatRoom')
  async createChatRoom(
    @Body()
    body: {
      name: string;
      type: string;
      password?: string;
      creatorId: string;
    },
  ) {
    return this.chatService.createChatRoom(body);
  }
  @Post('/getPublicChatRooms')
  async getPublicChatRooms() {
    return this.chatService.getPublicChatRooms();
  }
  @Post('/getChatRoomsIn')
  async getChatRoomsIn(
    @Body()
    body: {
      userId: string;
    },
  ) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.chatService.getChatRoomsIn(body.userId);
  }
  @Post('/joinChatRoom')
  async joinChatRoom(
    @Body()
    body: {
      channelId: string;
      userId: string;
      password?: string;
    },
  ) {
    if (!body.channelId || !body.userId) {
      throw new BadRequestException('channelId and userId are required');
    }
    return this.chatService.joinChatRoom(body);
  }
  // @Post('/setRoomOn')
  // async setRoomOn(
  //   @Body()
  //   body: {
  //     userId: string;
  //     channelId: string;
  //   },
  // ) {
  //   if (!body.userId || !body.channelId) {
  //     throw new BadRequestException('userId and channelId are required');
  //   }
  //   return this.chatService.setRoomOn(body.userId, body.channelId);
  // }
  @Post('/getChatRoomById')
  async getChatRoomById(
    @Body()
    body: {
      channelId: string;
    },
  ) {
    if (!body.channelId) {
      throw new BadRequestException('channelId is required');
    }
    return this.chatService.getChatRoomById(body.channelId);
  }
  @Post('/getUserNamesFromRoom')
  async getUserNamesFromRoom(
    @Body()
    body: {
      channelId: string;
    },
  ) {
    if (!body.channelId) {
      throw new BadRequestException('channelId is required');
    }
    return this.chatService.getUserNamesFromRoom(body.channelId);
  }
}
