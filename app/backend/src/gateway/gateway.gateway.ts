import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { SocketWithAuth } from './types/socket.types';
import { Server } from 'socket.io';
import { updatePlayerPosition } from 'src/game/dto/dto';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway()
export class GatewayGateway {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}
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

  @SubscribeMessage('UPDATE_PLAYER_POSITION')
  updatePositionPlayer(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() { gameId, keyPressed }: updatePlayerPosition,
  ) {
    const { userId } = client;
    const { game, index } = this.pongService.getGamebyIdAndReturnIndex(gameId);
  }
}
