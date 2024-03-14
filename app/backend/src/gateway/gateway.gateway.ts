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
import { UserService } from 'src/user/user.service';

@WebSocketGateway()
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}
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

  // MESSAGE
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

      const emitter = await this.prismaService.user.findUnique({
        where: { id: payload.message.emitterId },
        include: { BlockedUsers: true },
      });

      const blockedUserIds = emitter.BlockedUsers.map((user) => user.id);

      // Get all users in the chat room
      const usersInRoom = this.getAllSockeIdsByKey(payload.message.chatId);

      // Emit the message to all users in the room except the blocked ones
      usersInRoom.forEach((user) => {
        if (!blockedUserIds.includes(user)) {
          this.server.to(user).emit('MESSAGE', {
            id: newMessage.id,
            content: newMessage.content,
            chatId: newMessage.chatId,
            emitterId: newMessage.emitterId,
            emitterName: payload.message.emitterName,
            emitterAvatar: payload.message.emitterAvatar,
          });
        }
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

  // JOIN_ROOM
  @SubscribeMessage('JOIN_ROOM')
  async handleJoinRoom(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() payload: { room: string },
  ): Promise<string> {
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

      // send message to room
      const userName = await this.userService.getUserNameById({
        userId: client.userId,
      });
      await this.handleMessage({
        message: {
          id: '',
          content: userName + ' has joined the room',
          chatId: payload.room || '',
          emitterId: 'system',
          emitterName: 'System',
          emitterAvatar: '/robot.png',
        },
      });
      client.to(payload.room).emit('JOIN_ROOM', userName);
      return userName;
    } else {
      this.logger.error('Rooms are not defined.');
    }

    return 'Joined room : ' + payload.room;
  }

  // LEAVE_ROOM
  @SubscribeMessage('LEAVE_ROOM')
  async handleLeaveRoom(
    @MessageBody() payload: { room: string; userName: string },
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<string> {
    client.leave(payload.room);
    await this.handleMessage({
      message: {
        id: '',
        content: payload.userName + ' has left the room',
        chatId: payload.room || '',
        emitterId: 'system',
        emitterName: 'System',
        emitterAvatar: '/robot.png',
      },
    });
    // Get all clients in the room
    const clientsInRoom = await this.server.in(payload.room).allSockets();

    // If the room is empty, delete it from the database
    if (clientsInRoom.size === 0) {
      console.log('Room is empty, deleting room:', payload.room);

      // Delete all messages associated with the room
      await this.prismaService.message.deleteMany({
        where: { chatId: payload.room },
      });

      // Then delete the room
      await this.prismaService.chatroom.delete({
        where: { id: payload.room },
      });
    }
    this.server.to(payload.room).emit('LEAVE_ROOM', payload.userName);
    return 'Left room : ' + payload.room;
  }

  @SubscribeMessage('BLOCK_USER')
  async handleBlockUser(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: { blockerId: string; blockedUserId: string; value: boolean },
  ) {
    try {
      this.prismaService.user.update({
        where: { id: payload.blockerId },
        data: {
          BlockedUsers: {
            connect: {
              id: payload.blockedUserId,
            },
          },
        },
      });
      this.server.to(payload.blockedUserId).emit('BLOCKED', payload.blockerId);
    } catch (error) {
      console.error('Error blocking user:', error);
    }
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
