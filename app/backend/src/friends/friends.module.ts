import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [FriendsService, JwtService],
  controllers: [FriendsController]
})
export class FriendsModule {}
