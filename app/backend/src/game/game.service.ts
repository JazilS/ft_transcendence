import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPongGame } from './class/InterfaceGame';
import { GameInvitation } from './class/GameInvitation';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly games: IPongGame[] = [];
  private readonly gameQueue: Map<string, string>[] = [];
  private readonly gameLeavers: Map<string, boolean> = new Map<
    string,
    boolean
  >();
  private readonly gameInvitations: Map<string, GameInvitation> = new Map<
    string,
    GameInvitation
  >();

  static CreateGame(gameId: string, playerId: string, socketId: string) {
    return new PongGame(gameId, playerId, socketId);
  }
}
