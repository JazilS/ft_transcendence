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
import { ChatroomUser, User } from '@prisma/client';

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

  private getAllUserIdsByKey(key: string): string[] {
    const socketIds = this.server.of('/').adapter.rooms.get(key);
    return Array.from(socketIds).map(
      (id) => (this.server.of('/').sockets.get(id) as SocketWithAuth).userId,
      );
    }
    async handleConnection(client: SocketWithAuth) {
    console.log("USER IN HANDLE CONNECT")
    // const { sockets } = this.server.sockets;
    // const { id } = client;

    // this.logger.log(
    // `WS client with id: ${id} and userId : ${client.handshake.auth.token} connected!`,
    // );
    // this.logger.log(`Socket data: `, sockets);
    // this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    client.userId = client.handshake.auth.token;
    client.join(client.userId);

    // const rooms = this.server.of('/').adapter.rooms;
    // console.log({ rooms });
    // const room = this.server.of('/').adapter.rooms.get(client.userId);
    // this.logger.log('Room:', room);
  }

  async handleDisconnect(client: SocketWithAuth) {
    client.disconnect();
    console.log('client disconnected');
  }

  // MESSAGE
  @SubscribeMessage('MESSAGE')
  async handleMessage(
    // @MessageBody() payload: { message: Messages },
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

      const userExists = await this.prismaService.user.findUnique({
        where: { id: payload.message.emitterId },
      });

      if (!userExists) {
        throw new Error('User not found');
      }

      if (payload.message.emitterId !== 'system') {
        const userInChatroom: ChatroomUser =
          await this.prismaService.chatroomUser.findFirst({
            where: {
              chatroomId: payload.message.chatId,
              userId: payload.message.emitterId,
            },
          });
        if (!userInChatroom) throw 'User not in chatroom';
        if (userInChatroom.restriction === 'MUTED') throw 'User is muted';
      }

      // create message
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
      });

      const usersInRoom: string[] = this.getAllUserIdsByKey(
        payload.message.chatId,
      );

      // Get all users who blocked the emitter
      const blockedByUserIds: string[] = emitter.blockedByUsers.map(
        (user) => user,
      );

      usersInRoom.forEach((userId) => {
        // If the user has not blocked the emitter, send them the message
        if (!blockedByUserIds.includes(userId)) {
          this.server.to(userId).emit('MESSAGE', {
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
    @MessageBody() payload: { room: string; userId: string },
  ): Promise<string> {
    // check if room exists in db
    if (
      !this.prismaService.chatroom.findUnique({ where: { id: payload.room } })
    )
      return 'Room does not exist';

    try {
      // join room
      client.join(payload.room);

      if (this.server.of('/').adapter.rooms) {
        const sockets = this.server.of('/').adapter.rooms.get(payload.room);

        // Log the client's id
        this.logger.log('Client id:', client.userId);
        console.log(client.userId);
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
            emitterName: '',
            emitterAvatar: '/robot.png',
          },
        });

        const userProfile = await this.userService.getProfileById(
          payload.userId,
        );
        const userRole: ChatroomUser =
          await this.prismaService.chatroomUser.findFirst({
            where: {
              chatroomId: payload.room,
              userId: payload.userId,
            },
          });

        client.to(payload.room).emit('JOIN_ROOM', {
          userProfile: userProfile,
          role: userRole.role as string,
          fadeMenuInfos: this.userService.getFadeMenuInfos(
            client.userId,
            payload.userId,
            payload.room,
          ),
        });
        return userName;
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  }

  // LEAVE_ROOM
  @SubscribeMessage('LEAVE_ROOM')
  async handleLeaveRoom(
    @MessageBody()
    payload: {
      room: string;
      userName: string;
      userId: string;
      leavingType: string;
    },
    @ConnectedSocket() emitter: SocketWithAuth,
  ): Promise<string> {
    // leave socketRoom
    if (payload.leavingType === 'LEAVING') emitter.leave(payload.room);
    else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, socket] of this.server.of('/').sockets) {
        const client = socket as SocketWithAuth;

        // If the socket's userId matches the given userId, make it leave the room
        if (client.userId === payload.userId) {
          client.leave(payload.room);
          break;
        }
      }
    }

    // send message to all chat
    let messageContent: string;
    if (payload.leavingType === 'LEAVING')
      messageContent = payload.userName + ' has left the room';
    else if (payload.leavingType === 'KICKED')
      messageContent = payload.userName + ' is kicked from the room';
    else if (payload.leavingType === 'BANNED') {
      messageContent = payload.userName + ' is banned from the room';
      const user: User = await this.prismaService.user.findFirst({
        where: { id: payload.userId },
      });
      const bannedFromRooms = user.bannedFromRooms;
      bannedFromRooms.push(payload.room);
      console.log('Banned from rooms:', bannedFromRooms);
      await this.prismaService.user.update({
        where: { id: payload.userId },
        data: { bannedFromRooms: bannedFromRooms },
      });
    }

    await this.handleMessage({
      message: {
        id: '',
        content: messageContent,
        chatId: payload.room || '',
        emitterId: 'system',
        emitterName: '',
        emitterAvatar: '/robot.png',
      },
    });

    // Get all clients in the room
    const clientsInRoom = await this.server.in(payload.room).fetchSockets();

    // If the room is empty, delete it from the database
    if (clientsInRoom.length === 0) {
      // Delete all messages associated with the room
      console.log('Room is empty, deleting room:', payload.room);
      await this.prismaService.message.deleteMany({
        where: { chatId: payload.room },
      });

      // Then delete the room
      await this.prismaService.chatroom.delete({
        where: { id: payload.room },
      });
      return;
    }
    if (payload.leavingType === 'KICKED' || payload.leavingType === 'BANNED')
      this.server.to(payload.userId).emit('LEAVING_ROOM', payload.userName);
    this.server.to(payload.room).emit('UPDATE_CHAT_MEMBERS', payload.userId);
    // this.server.to(payload.room).emit('LEAVE_ROOM', payload.userName);
    return 'Left room : ' + payload.room;
  }

  @SubscribeMessage('BLOCK_USER')
  async handleBlockUser(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: { blockerId: string; blockedUserId: string; value: boolean },
  ) {
    try {
      let blockedMessageContent: string;

      // Blocker User
      let BlockerUser: User = await this.prismaService.user.findUnique({
        where: { id: payload.blockerId },
      });
      //Blocked User
      let BlockedUser: User = await this.prismaService.user.findUnique({
        where: { id: payload.blockedUserId },
      });

      if (!payload.value) {
        blockedMessageContent = ' blocked';
        // BLOCK (UPDATE BLOCKER USER)
        if (BlockerUser) {
          BlockerUser.blockedUsers.push(payload.blockedUserId);
          BlockerUser = await this.prismaService.user.update({
            where: { id: payload.blockerId },
            data: { blockedUsers: BlockerUser.blockedUsers },
          });

          // (UPDATE BLOCKED USER)
          if (BlockedUser) {
            BlockedUser.blockedByUsers.push(payload.blockerId);

            BlockedUser = await this.prismaService.user.update({
              where: { id: payload.blockedUserId },
              data: { blockedByUsers: BlockedUser.blockedByUsers },
            });
          }
        }
      } else {
        blockedMessageContent = ' unblocked';
        // UNBLOCK (UPDATE BLOCKER USER)
        if (BlockerUser) {
          BlockerUser.blockedUsers = BlockerUser.blockedUsers.filter(
            (id) => id !== payload.blockedUserId,
          );
          await this.prismaService.user.update({
            where: { id: payload.blockerId },
            data: { blockedUsers: BlockerUser.blockedUsers },
          });
        }

        // (UPDATE BLOCKED USER)
        if (BlockedUser)
          BlockedUser.blockedByUsers = BlockedUser.blockedByUsers.filter(
            (id) => id !== payload.blockerId,
          );
        await this.prismaService.user.update({
          where: { id: payload.blockedUserId },
          data: { blockedByUsers: BlockedUser.blockedByUsers },
        });
      }

      // create message
      const blockedMessage: Messages = {
        id: '',
        content:
          'You have been' + blockedMessageContent + ' by ' + BlockerUser.name,
        chatId: payload.blockedUserId,
        emitterId: 'system',
        emitterName: '',
        emitterAvatar: '/robot.png',
      };

      // send message to blocked user
      this.server.to(payload.blockedUserId).emit('MESSAGE', blockedMessage);
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  }

  @SubscribeMessage('PROMOTE_USER')
  async handlePromoteUser(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() payload: { targetId: string; roomOnId: string },
  ) {
    try {
      console.log('PROMOTE_USER:', payload);
      const userToPromote = await this.prismaService.chatroomUser.findFirst({
        where: { chatroomId: payload.roomOnId, userId: payload.targetId },
      });

      await this.prismaService.chatroomUser.update({
        where: { id: userToPromote.id },
        data: { role: 'ADMIN' },
      });
      this.server.to(payload.targetId).emit('PROMOTE_USER');
    } catch (error) {
      console.error('Error promoting user:', error);
    }
  }

  private muteIntervals: { [key: string]: NodeJS.Timeout } = {};

  @SubscribeMessage('MUTE_USER')
  async handleMuteUser(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: { roomId: string; mutedUser: string; muteTime: string },
  ) {
    try {
      console.log('MUTE_USER:', payload);
      const userToMute = await this.prismaService.chatroomUser.findFirst({
        where: { chatroomId: payload.roomId, userId: payload.mutedUser },
      });

      await this.prismaService.chatroomUser.update({
        where: { id: userToMute.id },
        data: { restriction: 'MUTED' },
      });
      let muteTimeLeft = parseInt(payload.muteTime);
      console.log('MUTE TIME LEFT = ', muteTimeLeft);
      this.server
        .to(payload.roomId)
        .emit('MUTE_USER', payload.mutedUser, muteTimeLeft);

      // Créer un nouvel intervalle pour cet utilisateur
      this.muteIntervals[payload.mutedUser] = setInterval(() => {
        muteTimeLeft -= 10;
        if (muteTimeLeft <= 0) {
          // Si le temps est écoulé, démuter l'utilisateur et effacer l'intervalle
          this.handleUnMuteUser(client, payload);
        } else {
          // Sinon, envoyer le temps restant au client
          this.server
            .to(payload.roomId)
            .emit('MUTE_USER', payload.mutedUser, muteTimeLeft);
        }
      }, 10000);
    } catch (error) {
      console.error('Error muting user:', error);
    }
  }

  @SubscribeMessage('UNMUTE_USER')
  async handleUnMuteUser(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: { roomId: string; mutedUser: string },
  ) {
    try {
      const userToMute = await this.prismaService.chatroomUser.findFirst({
        where: { chatroomId: payload.roomId, userId: payload.mutedUser },
      });

      await this.prismaService.chatroomUser.update({
        where: { id: userToMute.id },
        data: { restriction: 'NONE' },
      });

      // Effacer l'intervalle pour cet utilisateur
      clearInterval(this.muteIntervals[payload.mutedUser]);
      delete this.muteIntervals[payload.mutedUser];

      this.server.to(payload.roomId).emit('MUTE_USER', payload.mutedUser, 0);
    } catch (error) {
      console.error('Error muting user:', error);
    }
  }

  // @SubscribeMessage('GET_MUTE_TIME')
  // async handleGetMuteTime(
  //   @ConnectedSocket() client: SocketWithAuth,
  //   @MessageBody()
  //   payload: { roomId: string; mutedUser: string },
  // ) {
  //   try {
  //     // Vérifier si l'utilisateur est actuellement mute
  //     if (this.muteIntervals[payload.mutedUser]) {
  //       // Si oui, obtenir le temps restant de mute
  //       const muteTimeLeft = this.muteIntervals[payload.mutedUser].repeat;

  //       // Envoyer le temps restant de mute au client
  //       this.server.to(payload.mutedUser).emit('GET_MUTE_TIME', muteTimeLeft);
  //     } else {
  //       // Si non, envoyer 0 au client
  //       this.server.to(payload.mutedUser).emit('GET_MUTE_TIME', 0);
  //     }
  //   } catch (error) {
  //     console.error('Error getting mute time:', error);
  //   }
  // }

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
