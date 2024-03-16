import {
  ConnectedSocket,
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

@WebSocketGateway()
export class GatewayGateway {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly gameService: GameService,
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
    this.gameService.up;
  }
}
