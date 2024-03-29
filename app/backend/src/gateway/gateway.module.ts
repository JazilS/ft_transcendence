import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway.gateway';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { JwtService } from '@nestjs/jwt';
import { GameService } from 'src/game/game.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { GameModule } from 'src/game/game.module';
import { GatewayService } from './gateway.service';

@Module({
  imports: [PrismaModule, UserModule, GameModule],
  providers: [
    GameService,
    GatewayService,
    GatewayGateway,
    UserService,
    ChatService,
    JwtService,
  ],
  exports: [GatewayGateway],
})
export class GatewayModule {}
