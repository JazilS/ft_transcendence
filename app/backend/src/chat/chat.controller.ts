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
import { GetUser } from 'src/decorator/get.user.decorator';
import {
  CreateChatRoomDto,
  JoinChatRoomDto,
  GetChatRoomByIdDto,
  GetUserNamesFromRoomDto,
  GetMessagesFromRoomDto,
  GetProfilesFromRoomDto,
} from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/createChatRoom')
  async createChatRoom(@GetUser('id') userId: string, @Body() createChatRoomDto: CreateChatRoomDto) {
    createChatRoomDto.creatorId = userId;
    return await this.chatService.createChatRoom(createChatRoomDto);
  }

  @UseGuards(AuthGuard)
  @Post('/getPublicChatRooms')
  async getPublicChatRooms() {
    return await this.chatService.getPublicChatRooms();
  }

  @UseGuards(AuthGuard)
  @Post('/getChatRoomsIn')
  async getChatRoomsIn(@GetUser('id') userId, @Headers('authorization') authorization: string) {
    return await this.chatService.getChatRoomsIn(userId);
  }

  @UseGuards(AuthGuard)
  @Post('/joinChatRoom')
  async joinChatRoom(@GetUser('id') userId: string, @Body() joinChatRoomDto: JoinChatRoomDto) {
    if (!joinChatRoomDto.channelId) {
      throw new BadRequestException('channelId and userId are required');
    }
    else {
      return await this.chatService.joinChatRoom(joinChatRoomDto, userId);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/getChatRoomById')
  async getChatRoomById(@GetUser('id') userId: string, @Body() getChatRoomByIdDto: GetChatRoomByIdDto) {
    if (!getChatRoomByIdDto.channelId) {
      throw new BadRequestException('channelId is required');
    }
    return await this.chatService.getChatRoomById(getChatRoomByIdDto.channelId, userId);
  }

  @UseGuards(AuthGuard)
  @Post('/getUserNamesFromRoom')
  async getUserNamesFromRoom(@Body() getUserNamesFromRoomDto: GetUserNamesFromRoomDto) {
    if (!getUserNamesFromRoomDto.channelId) {
      throw new BadRequestException('channelId is required');
    }
    return await this.chatService.getUserNamesFromRoom(getUserNamesFromRoomDto.channelId);
  }

  @UseGuards(AuthGuard)
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
    return await this.chatService.addMessage(body);
  }
  
  @UseGuards(AuthGuard)
  @Post('/getMessagesFromRoom')
  async getMessagesFromRoom(@GetUser('id') userId: string, @Body() getMessagesFromRoomDto: GetMessagesFromRoomDto) {
    if (!getMessagesFromRoomDto.roomId) {
      throw new BadRequestException('channelId is required');
    }
    return await this.chatService.getMessagesFromRoom(getMessagesFromRoomDto.roomId, userId);
  }

  // a revoir quand je vais faire chatmembers
  @UseGuards(AuthGuard)
  @Post('/getProfilesFromRoom')
  async getProfilesFromRoom(@Body() getProfilesFromRoomDto: GetProfilesFromRoomDto) {
    return await this.chatService.getProfilesFromRoom(getProfilesFromRoomDto.channelId, getProfilesFromRoomDto.userId);
  }
}

// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Post,
//   Headers,
//   UseGuards,
//   // UseGuards,
// } from '@nestjs/common';
// import { ChatService } from './chat.service';
// import { JwtService } from '@nestjs/jwt';
// import { AuthGuard } from 'src/auth/auth.guard';
// import { GetUser } from 'src/decorator/get.user.decorator';

// @Controller('chat')
// export class ChatController {
//   constructor(
//     private readonly chatService: ChatService,
//     private jwtService: JwtService,
//   ) {}

//   @UseGuards(AuthGuard)
//   @Post('/createChatRoom')
//   async createChatRoom(@GetUser('id') userId: string,
//     @Body()
//     body: {
//       name: string;
//       type: string;
//       password?: string;
//       creatorId: string;
//     }) {
//       body.creatorId = userId;
//       return await this.chatService.createChatRoom(body);
//   }

//   @UseGuards(AuthGuard)
//   @Post('/getPublicChatRooms')
//   async getPublicChatRooms() {
//     return await this.chatService.getPublicChatRooms();
//   }

//   @UseGuards(AuthGuard)
//   @Post('/getChatRoomsIn')
//   async getChatRoomsIn(@GetUser('id') userId, @Headers('authorization') authorization: string) {
//       return await this.chatService.getChatRoomsIn(userId);
//   }

//   @UseGuards(AuthGuard)
//   @Post('/joinChatRoom')
//   async joinChatRoom(
//     @GetUser('id') userId: string,
//     @Body()
//     body: {
//       channelId: string;
//       password?: string;
//     },
//   ) {
//       if (!body.channelId) {
//         throw new BadRequestException('channelId and userId are required');
//       }
//       else {
//         return await this.chatService.joinChatRoom(body, userId);
//       }
//   }

//   @UseGuards(AuthGuard)
//   @Post('/getChatRoomById')
//   async getChatRoomById(@GetUser('id') userId: string, @Body() body: { channelId: string}) {
//       if (!body.channelId) {
//         throw new BadRequestException('channelId is required');
//       }
//       return await this.chatService.getChatRoomById(body.channelId, userId);
//   }

//   @UseGuards(AuthGuard)
//   @Post('/getUserNamesFromRoom')
//   async getUserNamesFromRoom(
//     @Body()
//     body: {
//       channelId: string;
//     },
//   ) {
//     if (!body.channelId) {
//       throw new BadRequestException('channelId is required');
//     }
//     return await this.chatService.getUserNamesFromRoom(body.channelId);
//   }


//   @UseGuards(AuthGuard)
//   @Post('/getMessagesFromRoom')
//   async getMessagesFromRoom(
//     @GetUser('id') userId: string,
//     @Body()
//     body: {
//       roomId: string;
//     },
//   ) {
//       if (!body.roomId) {
//         throw new BadRequestException('channelId is required');
//       }
//       return await this.chatService.getMessagesFromRoom(body.roomId, userId);
//   }

//   // a revoir quand je vais faire chatmembers
//   @UseGuards(AuthGuard)
//   @Post('/getProfilesFromRoom')
//   async getProfilesFromRoom(
//     @Body()
//     body: {
//       channelId: string;
//       userId: string;
//     },
//   ) {
//     return await this.chatService.getProfilesFromRoom(body.channelId, body.userId);
//   }
// }
