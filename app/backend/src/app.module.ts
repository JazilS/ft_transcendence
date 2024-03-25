import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
// import { GatewayModule } from './gateway/gateway.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
// import { GameController } from './game/game.controller';
// import { GameService } from './game/game.service';
// import { GameModule } from './game/game.module';
import { TwofaModule } from './twofa/twofa.module';
import { FriendsModule } from './friends/friends.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ChatModule,
    GatewayModule,
    UserModule,
    AuthModule,
    PrismaModule,
    TwofaModule,
    FriendsModule,
  ],
  controllers: [AppController /*GameController*/],
  providers: [AppService, ChatService /*GameService*/],
})
export class AppModule {}
 