import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
// import { ChatService } from 'src/chat/chat.service';
// import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [PrismaModule],
  providers: [UserService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
