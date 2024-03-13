import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  // WsException,
} from '@nestjs/websockets';
import { SocketWithAuth } from './types/socket.types';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import Messages from './types/Message.types';

@WebSocketGateway()
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(GatewayGateway.name);

  @WebSocketServer()
  server: Server;

  private getAllSockeIdsByKey(key: string) {
    return this.server.of('/').adapter.rooms.get(key);
  }

  async handleConnection(client: SocketWithAuth) {
    const { sockets } = this.server.sockets;
    const { id } = client;

    this.logger.log(
      `WS client with id: ${id} and userId : ${client.handshake.auth.token} connected!`,
    );
    this.logger.log(`Socket data: `, sockets);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    client.userId = client.handshake.auth.token;
    client.join(client.userId);

    const rooms = this.server.of('/').adapter.rooms;
    console.log({ rooms });
    const room = this.server.of('/').adapter.rooms.get(client.userId);
    this.logger.log('Room:', room);
  }

  async handleDisconnect(client: SocketWithAuth) {
    client.disconnect();
    console.log('client disconnected');
  }

  @SubscribeMessage('MESSAGE')
  async handleMessage(
    // @MessageBody() payload: { message: MessageDto },
    @MessageBody()
    payload: {
      message: Messages;
    },
    // @ConnectedSocket() client: SocketWithAuth,
  ) {
    console.log(
      'users in room:',
      this.getAllSockeIdsByKey(payload.message.chatId),
    );
    console.log('Message received:', payload.message);

    try {
      if (!payload.message.chatId || payload.message.chatId === '')
        throw 'No chatId provided';

      const newMessage = await this.prismaService.message.create({
        data: {
          content: payload.message.content,
          chat: {
            connect: {
              id: payload.message.chatId,
            },
          },
          emitter: {
            connect: {
              id: payload.message.emitterId,
            },
          },
        },
      });

      this.server.to(newMessage.chatId).emit('MESSAGE', {
        id: newMessage.id,
        content: newMessage.content,
        chatId: newMessage.chatId,
        emitterId: newMessage.emitterId,
        emitterName: payload.message.emitterName,
        emitterAvatar: payload.message.emitterAvatar,
      });
      console.log('Message sent: ', {
        id: newMessage.id,
        content: newMessage.content,
        chatId: newMessage.chatId,
        emitterId: newMessage.emitterId,
        emitterName: payload.message.emitterName,
        emitterAvatar: payload.message.emitterAvatar,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  @SubscribeMessage('JOIN_ROOM')
  handleJoinRoom(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() payload: { room: string },
  ): string {
    // check if room exists in db
    if (
      !this.prismaService.chatroom.findUnique({ where: { id: payload.room } })
    )
      return 'Room does not exist';
    client.join(payload.room);

    if (this.server.of('/').adapter.rooms) {
      const sockets = this.server.of('/').adapter.rooms.get(payload.room);

      // Log the client's id
      this.logger.log('Client id:', client.id);
      console.log('sockets in room', sockets);
    } else {
      this.logger.error('Rooms are not defined.');
    }

    return 'Joined room : ' + payload.room;
  }

  // createTokenMiddleware =
  //   (jwtService: JwtTokenService, logger: Logger) =>
  //   async (socket: SocketWithAuth, next) => {
  //     const token: string =
  //       socket.handshake.auth.token || socket.handshake.headers['token'];

  //     logger.debug(`Validating auth token before connection: ${token}`);

  //     try {
  //       const payload: JwtPayload = await jwtService.checkToken(
  //         token,
  //         process.env.ACCESS_TOKEN_SECRET,
  //       );
  //       socket.userId = payload.userId;

  //       next();
  //     } catch (error) {
  //       next(new WsException('TOKEN_INVALID'));
  //     }
  //   };
}
