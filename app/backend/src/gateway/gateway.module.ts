import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayGateway } from './gateway.gateway';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [GatewayService, GatewayGateway, UserService],
})
export class GatewayModule {}
