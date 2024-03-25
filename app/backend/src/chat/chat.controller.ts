import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Headers,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
  ) {}
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

  // @Post('/joinChatRoom')
  // async joinChatRoom(
  //   @Body()
  //   body: {
  //     channelId: string;
  //     userId: string;
  //     password?: string;
  //   },
  //   @Headers('Authorization') token: string,
  // ) {
  //   // decode the token
  //   // if the token is valid, then join the chat room
  //   console.log('hello world', body);
  //   if (!body.channelId || !body.userId) {
  //     throw new BadRequestException('channelId and userId are required');
  //   }
  //   return this.chatService.joinChatRoom(body);
  // }

  @Post('/joinChatRoom')
  async joinChatRoom(
    @Body()
    body: {
      channelId: string;
      password?: string;
    },
    @Headers('authorization') authorization: string,
  ) {
    // Remove 'Bearer ' from the start of the token
    const token = authorization.replace('Bearer ', '');

    try {
      // Replace 'your_secret_key' with the secret key you used to sign the token
      const decodedToken = this.jwtService.decode(token);
      const userId = decodedToken.id;

      console.log('Decoded user ID:', userId);

      console.log('DECODED TOKEN', decodedToken);
      if (!body.channelId) {
        throw new BadRequestException('channelId and userId are required');
      }
      return this.chatService.joinChatRoom(body, userId);
    } catch (error) {
      console.error('Invalid token');
      throw new BadRequestException('Invalid token');
    }
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
      userId: string;
    },
  ) {
    if (!body.channelId) {
      throw new BadRequestException('channelId is required');
    }
    return this.chatService.getChatRoomById(body.channelId, body.userId);
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

  @Post('/addMessage')
  async addMessage(
    @Body()
    body: {
      message: {
        data: {
          id: string;
          content: string;
          chatId: string;
          emitter: string;
        };
      };
    },
  ) {
    return this.chatService.addMessage(body);
  }

  @Post('/getMessagesFromRoom')
  async getMessagesFromRoom(
    @Body()
    body: {
      roomId: string;
    },
  ) {
    return this.chatService.getMessagesFromRoom(body.roomId);
  }
  @Post('/getProfilesFromRoom')
  async getProfilesFromRoom(
    @Body()
    body: {
      channelId: string;
      userId: string;
    },
  ) {
    return this.chatService.getProfilesFromRoom(body.channelId, body.userId);
  }
}
