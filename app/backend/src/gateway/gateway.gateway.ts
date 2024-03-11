import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  // WsException,
} from '@nestjs/websockets';
import { SocketWithAuth } from './types/socket.types';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import Messages from '../../../frontend/models/ChatRoom/messages';
import { subscribe } from 'diagnostics_channel';
// import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly prismaService: PrismaService) {}
  server: Server;
  async handleConnection(@ConnectedSocket() client: SocketWithAuth) {
    client.userId = client.handshake.auth.token;
    client.join(client.userId);
    console.log('client connected');
  }

  async handleDisconnect(client: SocketWithAuth) {
    console.log('client disconnected');
  }

  // @SubscribeMessage('MESSAGE')
  // handleEvent(payload: { message: Messages }): string {
  //   const sockets = this.server.sockets.adapter.rooms.get(
  //     payload.message.chatId,
  //   );
  //   if (sockets) {
  //     for (const socket of sockets) {
  //       this.server.to(socket).emit('events', payload.message);
  //     }
  //   }
  //   return 'Message sent to all users in room';
  // }

  @SubscribeMessage('MESSAGE')
  async handleEvent(payload: { message: Messages }): Promise<string> {
    const senderId = payload.message.emitter; // ID de l'utilisateur qui a envoyé le message
    const chatId = payload.message.chatId; // ID de la room

    // Récupérer les sockets connectés à la room
    const sockets = this.server.sockets.adapter.rooms.get(chatId);

    if (sockets) {
      for (const socketId of sockets) {
        const socket: SocketWithAuth = this.server.sockets.sockets.get(
          socketId,
        ) as SocketWithAuth;
        if (socket) {
          const receiverId = socket.userId; // ID de l'utilisateur qui recevra le message

          // Vérifier si l'expéditeur est bloqué par le destinataire
          const receiver = await this.prismaService.user.findUnique({
            where: { id: receiverId },
            include: { BlockedUsers: true },
          });

          if (
            receiver &&
            !receiver.BlockedUsers.some((user) => user.id === senderId)
          ) {
            // Si l'expéditeur n'est pas bloqué, envoyer le message
            socket.emit('events', payload.message);
          }
        }
      }
    }

    return 'Message sent to all users in room';
  }

  @SubscribeMessage('JOIN_ROOM')
  handleJoinRoom(client: SocketWithAuth, payload: { room: string }): string {
    // check if room exists in db
    if (
      !this.prismaService.chatroom.findUnique({ where: { id: payload.room } })
    )
      return 'Room does not exist';
    client.join(payload.room);
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
