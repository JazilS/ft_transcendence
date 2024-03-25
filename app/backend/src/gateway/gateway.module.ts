import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayGateway } from './gateway.gateway';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    GatewayService,
    GatewayGateway,
    UserService,
    ChatService,
    JwtService,
  ],
})
export class GatewayModule {}
