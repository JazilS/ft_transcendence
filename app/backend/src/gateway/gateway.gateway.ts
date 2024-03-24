import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SocketWithAuth } from './types/socket.types';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Interval } from '@nestjs/schedule';
import { FRAME_RATE } from '../../shared/constant';
import { GameService } from 'src/game/game.service';
import {
  GeneralEvent,
  PongEvent,
  PONG_ROOM_PREFIX,
} from '../../shared/socketEvent';

import { PongTypeNormal } from 'src/game/class/InterfaceGame';
import {
  GameIdDto,
  GameInvitationDto,
  PongGameTypeDto,
  updatePlayerPositionDto,
} from 'src/game/dto/dto';
import {
  WsBadRequestException,
  WsNotFoundException,
  WsUnauthorizedException,
  WsUnknownException,
  WsUserNotFoundException,
} from 'src/exception/customException';
import { LibService } from 'src/lib/lib.service';
import { UserData } from 'src/types/userInfo';
import { GAME_INVITATION_TIME_LIMIT } from 'src/game/class/GameInvitation';
import { UserIdDto } from 'src/user/dto/dto';

@WebSocketGateway()
export class GatewayGateway {
  constructor(
    private readonly pongService: GameService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly gameService: GameService,
    private readonly libService: LibService,
  ) {}
  server: Server;
  async handleConnection(@ConnectedSocket() client: SocketWithAuth) {
    client.join(client.userId);
    console.log('client connected');
  }

  // async handleDisconnect(client: SocketWithAuth) {
  //   console.log('client disconnected');
  // }

  @SubscribeMessage('MESSAGE')
  handleEvent(
    client: SocketWithAuth,
    payload: { id: string; message: string },
  ): string {
    const sockets = this.server.sockets.adapter.rooms.get(payload.id);
    if (sockets) {
      for (const socket of sockets) {
        this.server.to(socket).emit('events', payload.message);
      }
    }
    return 'Message sent to all users in room';
  }
  //-----------------------------------------------------------------------------------------------------------------
  @Interval(FRAME_RATE)
  async updateGame() {
    this.gameService.gameUpdate(this.server);
  }

  @SubscribeMessage(PongEvent.JOIN_QUEUE)
  async joinQueue(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() { pongType }: PongGameTypeDto,
  ) {
    const { userId } = client;

    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) throw new WsUserNotFoundException();
    const inARoom = this.pongService.checkIfUserIsAlreadyInARoom(userId);

    if (inARoom) {
      throw new WsBadRequestException(
        'You are already in a room, please leave it before rejoining the queue',
      );
    }

    if (this.pongService.hasActiveInvitation(userId)) {
      throw new WsUnauthorizedException(
        'You must undo invitation before joining queue',
      );
    }

    const data = await this.pongService.checkIfMatchupPossible(
      userId,
      client.id,
      pongType,
    );

    if (data) {
      const { room, creator } = data;

      if (creator === undefined) throw new WsUserNotFoundException();

      const senderSocket = this.libService.getSocket(
        this.server,
        creator.socketId,
      );

      if (!senderSocket) {
        this.pongService.deleteGameRoomGameById(room);
        throw new WsUnknownException(
          `${user.nickname} is currently not online`,
        );
      }

      await this.pongService.joinGame(
        this.server,
        room,
        {
          creator: creator,
          opponent: {
            nickname: user.nickname,
            avatar: user.profile.avatar,
          },
        },
        userId,
        creator.id,
        client,
        senderSocket as SocketWithAuth,
      );
      return;
    }

    this.pongService.createGameRoom(userId, client.id, pongType);
    this.libService.sendToSocket(this.server, userId, GeneralEvent.SUCCESS, {
      message: 'Please wait for an opponent',
    });
  }

  @SubscribeMessage(PongEvent.LEAVE_QUEUE)
  async leaveQueue(@ConnectedSocket() client: SocketWithAuth) {
    const { userId } = client;

    const user = await this.userService.findUserById(userId, UserData);
    if (!user) throw new WsUserNotFoundException();

    const game = this.pongService.checkIfUserIsAlreadyInARoom(userId);

    if (game) {
      this.pongService.deleteGameRoomGameById(game.getGameId);
    }
    this.libService.sendToSocket(this.server, userId, GeneralEvent.SUCCESS);
  }

  @SubscribeMessage(PongEvent.SEND_GAME_INVITATION)
  async sendGameInvitation(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() { id, pongType }: GameInvitationDto,
  ) {
    const { userId } = client;
    if (userId === id) {
      throw new WsUnauthorizedException('You cannot invite yourself');
    }

    const [me, user] = await Promise.all([
      this.prismaService.user.findFirst({
        where: { id: userId },
        include: {
          blockedBy: {
            where: { id },
          },
        },
      }),
      this.userService.findUserById(id, UserData),
    ]);

    if (!me || !user) throw new WsUserNotFoundException();

    if (me.blockedBy.length > 0) {
      throw new WsBadRequestException('You are blocked by this user');
    }

    const game = this.pongService.checkIfUserIsAlreadyInARoom(userId);

    if (!this.getAllSockeIdsByKey(user.id))
      throw new WsUnknownException('User is not online');
    if (game) {
      if (!game.hasStarted) {
        throw new WsBadRequestException(
          "You can't invite a user while still in queue, please unqueue first",
        );
      }

      if (game.hasStarted) {
        throw new WsBadRequestException(
          "You can't invite a user while playing a game",
        );
      }
    }

    const gameUser = this.pongService.checkIfUserIsAlreadyInARoom(id);

    if (gameUser) {
      if (!gameUser.hasStarted) {
        throw new WsBadRequestException(
          'User must leave queue before to receive game invitation',
        );
      }

      if (gameUser.hasStarted) {
        throw new WsBadRequestException('User is already in a game');
      }
    }

    const response = this.pongService.isUserInvitable(id);

    if (response) throw new WsUnauthorizedException(response);

    const gameInvit = this.pongService.addNewGameInvitation(
      PONG_ROOM_PREFIX + userId,
      client.id,
      userId,
      id,
      pongType,
    );

    if (gameInvit) {
      throw new WsUnauthorizedException(
        `You already sent an invitation to another player, you must wait ${gameInvit} seconds before sending a new one, or cancel the previous one`,
      );
    }

    client.emit(GeneralEvent.SUCCESS, {
      message: `Game invitation succesfully sent to ${user.nickname}`,
    });

    this.libService.sendToSocket(
      this.server,
      id,
      PongEvent.RECEIVE_GAME_INVITATION,
      {
        message: `${me.nickname} invited you to a play ${
          pongType === PongTypeNormal ? 'normal' : 'special'
        } pong game`,
        data: { id: userId },
      },
    );
  }

  @SubscribeMessage(PongEvent.JOIN_BACK_CURRENT_GAME)
  async joinCurrentGame(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() { gameId }: GameIdDto,
  ) {
    const game = this.pongService.getGameById(gameId);

    if (!game) throw new WsNotFoundException('Game not found');

    if (game.endGame()) throw new WsUnknownException('Game ended');

    this.libService.emitBackToMyself(client, GeneralEvent.SUCCESS, {
      data: {
        gameId,
      },
    });
  }

  @SubscribeMessage(PongEvent.ACCEPT_GAME_INVITATION)
  async acceptGameInvitation(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() { id }: UserIdDto,
  ) {
    const { userId } = client;

    const [me, user] = await Promise.all([
      this.userService.findUserById(userId, UserData),
      this.userService.findUserById(id, UserData),
    ]);
    if (!me || !user) throw new WsUserNotFoundException();

    const myGame = this.pongService.checkIfUserIsAlreadyInARoom(userId);

    if (myGame) {
      if (!myGame.hasStarted) {
        throw new WsBadRequestException(
          "You can't accept an invitation while still in queue, please unqueue first",
        );
      }

      if (myGame.hasStarted) {
        throw new WsBadRequestException(
          "You can't accept an invitation while playing a game",
        );
      }
    }

    const gameUser = this.pongService.checkIfUserIsAlreadyInARoom(id);

    if (gameUser) {
      if (!gameUser.hasStarted) {
        throw new WsBadRequestException('The user is currently in queue, ');
      }

      if (gameUser.hasStarted) {
        throw new WsBadRequestException('User is already in a game');
      }
    }

    const invitation = this.pongService.getInvitation(id, userId);

    if (!invitation) {
      throw new WsBadRequestException(
        'That user did not send you any invitation',
      );
    }

    if (!invitation.hasExpired)
      throw new WsUnauthorizedException(
        `User invitaion has expired, invitation last at most ${GAME_INVITATION_TIME_LIMIT}`,
      );

    const gameId: string = invitation.getGameId;
    const senderSocket = this.libService.getSocket(
      this.server,
      invitation.getSocketId,
    );

    if (!senderSocket) {
      throw new WsUnknownException(`${user.nickname} is currently not online`);
    }

    this.pongService.addNewGameRoom({
      gameId,
      id,
      userId,
      socketId: invitation.getSocketId,
      otherSocketId: client.id,
      pongGameType: invitation.getPongType,
    });

    this.libService.sendToSocket(this.server, userId, GeneralEvent.SUCCESS);

    await this.pongService.joinGame(
      this.server,
      gameId,
      {
        creator: { nickname: user.nickname, avatar: user.profile.avatar },
        opponent: { nickname: me.nickname, avatar: me.profile.avatar },
      },
      userId,
      id,
      client,
      senderSocket as SocketWithAuth,
    );
  }

  @SubscribeMessage(PongEvent.UPDATE_PLAYER_POSITION)
  updatePlayerPosition(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() { gameId, keyPressed }: updatePlayerPositionDto,
  ) {
    const { userId } = client;
    const [game, index] = this.pongService.getGameByIdAndReturnIndex(gameId);

    if (index === -1) return;

    if (!game.getPlayers.includes(userId)) {
      throw new WsUnauthorizedException('You are not in this game');
    }
    this.pongService.updateGamePlayerPosition(index, userId, keyPressed);
  }

  @SubscribeMessage(PongEvent.USER_STOP_UPDATE)
  stopUserMovement(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() { gameId, keyPressed }: updatePlayerPositionDto,
  ) {
    const { userId } = client;
    const game = this.pongService.getGameById(gameId);

    if (!game) return;

    if (!game.getPlayers.includes(userId)) {
      throw new WsUnauthorizedException('You are not in this game');
    }
    game.stopUpdatePlayerPosition(userId, keyPressed);
    this.pongService.updateGameById(gameId, game);
  }

  @SubscribeMessage(PongEvent.DECLINE_GAME_INVITATION)
  async declineGameInvitation(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() { id }: UserIdDto,
  ) {
    const { userId } = client;
    const [me, user] = await Promise.all([
      this.userService.findUserById(userId, UserData),
      this.userService.findUserById(id, UserData),
    ]);

    if (!me || !user) throw new WsUserNotFoundException();

    const gameId = this.pongService.deleteInvitation(id);
    if (gameId) {
      this.libService.sendToSocket(
        this.server,
        id,
        PongEvent.USER_DECLINED_INVITATION,
        {
          message: `${me.nickname} declined your invitation`,
          severity: 'info',
        },
      );
    }
    this.libService.sendToSocket(this.server, userId, GeneralEvent.SUCCESS);
  }

  private getAllSockeIdsByKey(key: string) {
    return this.server.of('/').adapter.rooms.get(key);
  }
}
