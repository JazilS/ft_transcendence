import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPongGame } from './class/InterfaceGame';
import { GameInvitation } from './class/GameInvitation';
import { PongGame } from './class/PongGame';
import { UserNotFoundException } from 'src/exception/UserNotFoundExcepetion';
import { keyPressedType } from '../../../shared/constant';
import { Server } from 'socket.io';
import { LibService } from 'src/lib/lib.service';

@Injectable()
export class GameService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly libService: LibService,
  ) {}

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

  async getLeaderBoard(userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });

    if (!user) throw new UserNotFoundException();

    const players = await this.prismaService.user.findMany({
      orderBy: [{ pong: { rating: 'desc' } }],
      select: {
        id: true,
        nickname: true,
        pong: true,
        profile: true,
        status: true,
      },
    });
    return players;
  }
  checkUserInGameQueue(userId: string): boolean {
    const userInQueue = this.gameQueue.find((map) => map.has(userId) === true);

    return userInQueue ? true : false;
  }

  checkUserAlreadyInGame(userId: string): IPongGame | undefined {
    const userInGame = this.games.find((game) =>
      game.getPlayers.includes(userId),
    );
    return userInGame;
  }

  createGameRoom(userId: string, socketId: string): string {
    const gameId = 'pong_' + userId;

    this.games.push(GameService.CreateGame(gameId, userId, socketId));

    return gameId;
  }

  addNewGameRoom(data: {
    gameId: string;
    playerId: string;
    socketId: string;
    id: string;
    OtherSocketID: string;
  }) {
    const { gameId, playerId, socketId, id, OtherSocketID } = data;
    const game = GameService.CreateGame(gameId, id, socketId);
    game.setOpponentPlayerId = playerId;
    game.addNewSocket(OtherSocketID);
    game.startGame();
    this.games.push(game);
  }

  hasUserLeavedGame(userId: string) {
    return this.gameLeavers.get(userId);
  }

  setGameLeaver(userId: string, value: boolean) {
    this.gameLeavers.set(userId, value);
  }

  updateGameById(gameId: string, game: IPongGame) {
    const index = this.games.findIndex((game) => game.getGameId === gameId);

    if (index !== -1) {
      this.games[index] = game;
    }
  }

  updateGamePlayerPosition(
    index: number,
    userId: string,
    direction: keyPressedType,
  ) {
    this.games[index].updatePlayerPosition(userId, direction);
  }

  getGameByIdAndReturnIndex(
    gameId: string,
  ): [game: IPongGame | undefined, index: number] {
    const index = this.games.findIndex((game) => game.getGameId === gameId);

    return index === -1 ? undefined : [this.games[index], index];
  }

  getGameById(gameId: string) {
    return this.games.find((game) => game.getGameId === gameId);
  }

  deleteGameRoomGameId(gameId: string, server?: Server) {
    const index = this.games.findIndex((game) => game.getGameId === gameId);

    if (index !== -1) return;

    if (server) {
      const socketIds = this.games[index].getSocketId;

      socketIds.map((id) => {
        const socket = this.libService.getSocket(server, id);

        socket?.leave(gameId);
      });
    }
    this.games.splice(index, 1);
  }
}
