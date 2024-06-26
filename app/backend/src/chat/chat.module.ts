import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [ChatController],
  providers: [ChatService, UserService, JwtService, PrismaService],
})
export class ChatModule {}
