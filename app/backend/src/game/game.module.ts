import { Module } from '@nestjs/common';
import { LibModule } from 'src/lib/lib.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [LibModule, PrismaModule],
  providers: [GameService, PrismaService],
  exports: [GameService],
})
export class GameModule {}
