import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway.gateway';
import { GameService } from 'src/game/game.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [PrismaModule, UserModule, GameModule],
  providers: [GameService, GatewayGateway],
  exports: [GatewayGateway],
})
export class GatewayModule {}
