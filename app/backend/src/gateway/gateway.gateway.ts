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
import { GeneralEvent, PongEvent } from '../../../shared/socketEvent';
import { PongGameType } from 'src/game/class/InterfaceGame';
import { GameInvitationDto, PongGameTypeDto } from 'src/game/dto/dto';
import {
  WsBadRequestException,
  WsUnauthorizedException,
  WsUnknownException,
  WsUserNotFoundException,
} from 'src/exception/customException';
import { LibService } from 'src/lib/lib.service';
import { UserData } from 'src/types/userInfo';

@WebSocketGateway()
export class GatewayGateway {
  pongService: any;
  constructor(
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
  }
}
