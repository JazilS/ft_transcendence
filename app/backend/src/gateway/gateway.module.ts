import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayGateway } from './gateway.gateway';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';

@Module({
  providers: [GatewayService, GatewayGateway, UserService, ChatService],
})
export class GatewayModule {}
