import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
// import { ChatService } from 'src/chat/chat.service';
// import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [UserService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
