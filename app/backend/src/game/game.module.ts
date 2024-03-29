import { Module } from '@nestjs/common';
import { LibModule } from 'src/lib/lib.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameService } from './game.service';

@Module({
  imports: [PrismaModule, LibModule],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
