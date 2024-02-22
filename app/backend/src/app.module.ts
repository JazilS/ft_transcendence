import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { GatewayModule } from './gateway/gateway.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ChatModule, GatewayModule, UserModule],
  controllers: [AppController],
  providers: [AppService, ChatService],
})
export class AppModule {}
