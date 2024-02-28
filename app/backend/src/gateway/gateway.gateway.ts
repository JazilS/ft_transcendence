import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { SocketWithAuth } from './types/socket.types';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
@WebSocketGateway()
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  server: Server;
  async handleConnection(@ConnectedSocket() client: SocketWithAuth) {
    client.join(client.userId);
    console.log('client connected');
  }

  async handleDisconnect(client: SocketWithAuth) {
    console.log('client disconnected');
  }

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
