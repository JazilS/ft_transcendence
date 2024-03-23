import { Module } from '@nestjs/common';
import { TwofaService } from './twofa.service';
import { TwofaController } from './twofa.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TwofaService, JwtService],
  controllers: [TwofaController]
})
export class TwofaModule {}
