import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  // @UseGuards(AuthGuard)
  @Post('/createChatRoom')
  async createChatRoom(
    @Body()
    body: {
      name: string;
      type: string;
      password?: string;
      creatorId: string;
    },
    @Headers('authorization') authorization: string,
  ) {
    const token = authorization.replace('Bearer ', '');

    try {
      const decodedToken = this.jwtService.decode(token);
      const userId = decodedToken.id;

      console.log('Decoded user ID in createChatroom:', userId);
      body.creatorId = userId;
      return this.chatService.createChatRoom(body);
    } catch (error) {
      console.error('Invalid token');
      throw new BadRequestException('Invalid token');
    }
  }

  // @UseGuards(AuthGuard)
  @Post('/getPublicChatRooms')
  async getPublicChatRooms() {
    return this.chatService.getPublicChatRooms();
  }

  // @UseGuards(AuthGuard)
  @Post('/getChatRoomsIn')
  async getChatRoomsIn(@Headers('authorization') authorization: string) {
    // Remove 'Bearer ' from the start of the token
    const token = authorization.replace('Bearer ', '');

    try {
      // Replace 'your_secret_key' with the secret key you used to sign the token
      const decodedToken = this.jwtService.decode(token);
      const userId = decodedToken.id;

      console.log('Decoded user ID in getpublicChatrooms:', userId);

      // console.log('DECODED TOKEN', decodedToken);
      return this.chatService.getChatRoomsIn(userId);
    } catch (error) {
      console.error('Invalid token');
      throw new BadRequestException('Invalid token');
    }
  }

  // @UseGuards(AuthGuard)
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
      console.log('Decoded user ID in joinChatRoom:', userId);
      if (!body.channelId) {
        throw new BadRequestException('channelId and userId are required');
      }
      return this.chatService.joinChatRoom(body, userId);
    } catch (error) {
      console.error('Invalid token');
      throw new BadRequestException('Invalid token');
    }
  }

  // @UseGuards(AuthGuard)
  @Post('/getChatRoomById')
  async getChatRoomById(
    @Body()
    body: {
      channelId: string;
    },
    @Headers('authorization') authorization: string,
  ) {
    try {
      const token = authorization.replace('Bearer ', '');

      if (!body.channelId) {
        throw new BadRequestException('channelId is required');
      }
      // Replace 'your_secret_key' with the secret key you used to sign the token
      const decodedToken = this.jwtService.decode(token);
      const userId = decodedToken.id;
      console.log('Decoded user ID in joinChatRoom:', userId);
      if (!body.channelId) {
        throw new BadRequestException('channelId is required');
      }
      return this.chatService.getChatRoomById(body.channelId, userId);
    } catch (error) {
      console.error('Invalid token');
      throw new BadRequestException('Invalid token');
    }
  }

  // @UseGuards(AuthGuard)
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

  // not used
  // @UseGuards(AuthGuard)
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

  // @UseGuards(AuthGuard)
  @Post('/getMessagesFromRoom')
  async getMessagesFromRoom(
    @Body()
    body: {
      roomId: string;
    },
  ) {
    return this.chatService.getMessagesFromRoom(body.roomId);
  }

  // a revoir quand je vais faire chatmembers
  // @UseGuards(AuthGuard)
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
