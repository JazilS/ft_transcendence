import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPongGame } from './class/InterfaceGame';
import { GameInvitation } from './class/GameInvitation';
import { PongGame } from './class/PongGame';
import { UserNotFoundException } from 'src/exception/UserNotFoundExcepetion';
import { keyPressedType } from '../../shared/constant';
import { Server } from 'socket.io';
import { LibService } from 'src/lib/lib.service';
import { PlayerStartGameInfo, StartGameInfo } from '../../shared/types';
import { SocketWithAuth } from 'src/gateway/types/socket.types';
import { WsUnknownException } from '../exception/customException';
import { PongEvent } from '../../shared/socketEvent';
import { STATUS } from '@prisma/client';

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

  deleteGameRoomGameById(gameId: string, server?: Server) {
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

  leaveQueue(userId: string) {
    const index = this.gameQueue.findIndex((map) => map.has(userId));

    if (index !== -1) {
      return;
    }
  }

  leaveRoom(userId: string) {
    const index = this.games.findIndex((game) =>
      game.getPlayers.includes(userId),
    );

    if (index === -1) return;

    this.games[index].removePlayer(userId);
    if (this.games[index].getPlayers.length === 0) {
      this.games.splice(index, 1);
    }
  }

  async gameUpdate(server: Server) {
    for (const [index, game] of this.games.entries()) {
      if (game.getGameStarted) {
        game.update();
        this.libService.sendToSocket(
          server,
          game.getGameId,
          PongEvent.UPDATE_GAME,
          {
            data: game.getUpdatedData(),
          },
        );
        if (game.endGame()) {
          let data = { message: 'Draw' };
          const winnerId = game.getWinner.getPlayerId;
          const loserId = game.getLoser.getPlayerId;
          if (!game.getDraw) {
            data = await this.setPongWinner(winnerId, loserId);
          }
          this.libService.sendToSocket(
            server,
            game.getGameId,
            PongEvent.END_GAME,
            {
              data,
            },
          );
          this.deleteGameRoomByIndex(index, server);
          this.libService.deleteSocketRoom(server, game.getGameId);
          this.libService.updateUserStatus(server, {
            ids: [winnerId, loserId],
            status: STATUS.ONLINE,
          });
        }
      }
    }
  }

  private deleteGameRoomByIndex(index: number, server?: Server) {
    if (this.games[index]) {
      const { getSocketId, getGameId } = this.games[index];
      if (server) {
        getSocketId.map((id) => {
          const socket = this.libService.getSocket(server, id);

          socket?.leave(getGameId);
        });
      }

      this.games.splice(index, 1);
    }
  }

  private async setPongWinner(
    winnerId: string,
    loserId: string,
  ): Promise<{ message: string | undefined }> {
    const winner = await this.prismaService.user.findFirst({
      where: { id: winnerId },
      select: { pong: true, profile: true, nickname: true },
    });

    const loser = await this.prismaService.user.findFirst({
      where: { id: loserId },
      select: { pong: true, profile: true, nickname: true },
    });

    if (!winner || !loser) return { message: undefined };

    await this.prismaService.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: winnerId },
        data: { status: STATUS.ONLINE },
      });
      await tx.user.update({
        where: { id: loserId },
        data: { status: STATUS.ONLINE },
      });
      await tx.pong.upsert({
        where: { userId: loserId },
        create: { userId: loserId, losses: 1 },
        update: { losses: { increment: 1 } },
      });
      await tx.pong.upsert({
        where: { userId: winnerId },
        create: {
          userId: winnerId,
          victory: 1,
          rating: 10,
          winnedGame: {
            create: {
              looser: { connect: { userId: loserId } },
            },
          },
        },
        update: {
          victory: { increment: 1 },
          rating: { increment: 10 },
          winnedGame: {
            create: {
              looser: { connect: { userId: loserId } },
            },
          },
        },
      });
    });
    return { message: `${winner.nickname} has won the game` };
  }

  async joinGame(
    server: Server,
    room: string,
    {
      creator,
      opponent,
    }: { creator: PlayerStartGameInfo; opponent: PlayerStartGameInfo },
    userId: string,
    creatorId: string,
    mySocket: SocketWithAuth,
    otherSocket: SocketWithAuth,
  ) {
    const data: StartGameInfo = {
      room,
      creator,
      opponent,
    };

    try {
      await this.prismaService.$transaction([
        this.prismaService.user.update({
          where: { id: userId },
          data: { status: STATUS.PLAYING },
        }),
        this.prismaService.user.update({
          where: { id: creatorId },
          data: { status: STATUS.PLAYING },
        }),
      ]);
    } catch (error) {
      this.deleteGameRoomGameById(room);
      throw new WsUnknownException('error');
    }
    this.libService.updateUserStatus(server, {
      ids: [userId, creator.id as string],
      status: 'PLAYING',
    });

    mySocket.join(room);
    otherSocket.join(room);
    server.to(room).emit(PongEvent.LETS_PLAY, { data });
  }

  async checkIfMatchupPossible(
    userId: string,
    socketId: string,
  ): Promise<
    { room?: string; creator: PlayerStartGameInfo | undefined } | undefined
  > {
    const index = this.games.findIndex((game) => game.getPlayers.length === 1);
    if (index === -1) return undefined;

    const creator = await this.prismaService.user.findFirst({
      where: { id: this.games[index].getPlayer.getPlayerId },
      include: { profile: true },
    });
    if (!creator) {
      this.deleteGameRoomByIndex(index);
      return { creator: undefined };
    }

    const creatorSocketId = this.games[index].getSocketId[0] ?? undefined;

    this.games[index].setOpponentPlayerId = userId;
    this.games[index].setNewSocketId = socketId;
    this.games[index].startGame();
    return {
      room: this.games[index].getGameId,
      creator: {
        id: creator.id,
        nickname: creator.nickname,
        avatar: creator.profile.avatar,
        socketId: creatorSocketId,
      },
    };
  }

  updateGameByUserId(game: IPongGame, userId: string) {
    const index = this.games.findIndex((game) =>
      game.getPlayers.includes(userId),
    );

    if (index >= 0) {
      this.games[index] = game;
    }
  }
}
