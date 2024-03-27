import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketWithAuth } from './types/socket.types';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import Messages from './types/Message.types';
import { UserService } from 'src/user/user.service';
import { ChatroomUser, TYPE, User } from '@prisma/client';
import RoomData from './types/RoomData.types';

@WebSocketGateway()
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(GatewayGateway.name);

  @WebSocketServer()
  server: Server;

  private getAllSockeIdsByKey(key: string) {
    return this.server.of('/').adapter.rooms.get(key);
  }

  private getAllUserIdsByKey(key: string): string[] {
    const socketIds = this.server.of('/').adapter.rooms.get(key);
    if (!socketIds) return [];
    return Array.from(socketIds).map(
      (id) => (this.server.of('/').sockets.get(id) as SocketWithAuth).userId,
    );
  }
  async handleConnection(client: SocketWithAuth) {
    console.log('USER IN HANDLE CONNECT');
    // const { sockets } = this.server.sockets;
    // const { id } = client;

    // this.logger.log(
    // `WS client with id: ${id} and userId : ${client.handshake.auth.token} connected!`,
    // );
    // this.logger.log(`Socket data: `, sockets);
    // this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    try {
      // if (client.handshake.auth.token) {
      // client.disconnect(true);
      // return;
      // }
      const decodedToken = this.jwtService.decode(client.handshake.auth.token);
      const userId = decodedToken.id;
      client.userId = userId;
      console.log('client.userId:', client.userId);
    } catch (error) {
      console.error('Invalid token in gateway', error);
    }
    client.join(client.userId);
    // const { sockets } = this.server.sockets;
    // console.log('All connected sockets:');
    // for (const id in sockets) {
    // const socket = sockets[id] as SocketWithAuth;
    // console.log(`Socket ID: ${id}, User ID: ${socket.userId}`);
    // }
    // const rooms = this.server.of('/').adapter.rooms;
    // console.log({ rooms });
    // const room = this.server.of('/').adapter.rooms.get(client.userId);
    // console.log('Room:', room);
  }

  async handleDisconnect(client: SocketWithAuth) {
    console.log('client disconnected', client.userId);
    client.disconnect();
  }

  // MESSAGE
  @SubscribeMessage('MESSAGE')
  async handleMessage(
    // @MessageBody() payload: { message: Messages },
    @MessageBody()
    payload: {
      message: Messages;
    },
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    console.log(
      'users in room:',
      this.getAllUserIdsByKey(payload.message.chatId),
    );
    if (payload.message.emitterId !== 'system' && !client.userId)
      throw 'Unauthorized';
    try {
      if (!payload.message.chatId || payload.message.chatId === '')
        throw 'No chatId provided';

      if (payload.message.emitterId === 'system') {
        if (
          !(await this.prismaService.user.findUnique({
            where: { id: 'system' },
          }))
        ) {
          console.log('creating system user');
          await this.prismaService.user.create({
            data: {
              id: 'system',
              email: '',
              name: '',
              status: 'ONLINE',
              avatar: '/robot.png',
            },
          });
        }
      }
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
      console.log('usersInRoom:', usersInRoom);
      // Get all users who blocked the emitter
      const blockedByUserIds: string[] = emitter.blockedByUsers.map(
        (user) => user,
      );

      console.log('Message sent: ', {
        id: newMessage.id,
        content: newMessage.content,
        chatId: newMessage.chatId,
        emitterId: newMessage.emitterId,
        emitterName: payload.message.emitterName,
        emitterAvatar: payload.message.emitterAvatar,
      });
      usersInRoom.forEach((userId) => {
        // If the user has not blocked the emitter, send them the message
        if (!blockedByUserIds.includes(userId)) {
          console.log('Sending message to:', userId);
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
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  // JOIN_ROOM

  @SubscribeMessage('JOIN_SOCKET_ROOM')
  handleJoinSocketRoom(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() payload: { room: string },
  ) {
    const room = payload.room;
    let isAlreadyInRoom: boolean = false;

    const roomSet = this.server.of('/').adapter.rooms.get(room);
    if (roomSet) {
      roomSet.forEach((id) => {
        if (id === client.id) isAlreadyInRoom = true;
      });
    }

    if (!isAlreadyInRoom) {
      console.log('JOIN_SOCKET_ROOM', room);
      client.join(room);
    }
  }

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
        console.log('getUsername by Id :', client.userId);
        const userName = await this.userService.getUserNameById({
          userId: client.userId,
        });
        await this.handleMessage(
          {
            message: {
              id: '',
              content: userName + ' has joined the room',
              chatId: payload.room || '',
              emitterId: 'system',
              emitterName: '',
              emitterAvatar: '/robot.png',
            },
          },
          client,
        );

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

        client.to(payload.room).emit(
          'JOIN_ROOM',
          {
            userProfile: userProfile,
            role: userRole.role as string,
            fadeMenuInfos: this.userService.getFadeMenuInfos(
              client.userId,
              payload.userId,
              payload.room,
            ),
          },
          payload.room,
        );
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
    if (payload.leavingType === 'LEAVING') payload.userId = emitter.userId;
    if (!payload.room) throw 'No room provided';
    if (!payload.userId) throw 'No userId provided';
    if (!payload.leavingType) throw 'No leavingType provided';
    if (payload.leavingType === 'LEAVING' && emitter.userId !== payload.userId)
      throw 'Unauthorized';
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
    console.log('userId = ', payload.userId);
    console.log('room = ', payload.room);
    const userInChatroom = await this.prismaService.chatroomUser.findFirst({
      where: { chatroomId: payload.room, userId: payload.userId },
    });
    console.log('userInchatroom : ', userInChatroom);
    await this.prismaService.chatroomUser.delete({
      where: { id: userInChatroom.id },
    });

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

    await this.handleMessage(
      {
        message: {
          id: '',
          content: messageContent,
          chatId: payload.room || '',
          emitterId: 'system',
          emitterName: '',
          emitterAvatar: '/robot.png',
        },
      },
      emitter,
    );

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
    this.server
      .to(payload.room)
      .emit('UPDATE_CHAT_MEMBERS', payload.userId, payload.room);
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

  @SubscribeMessage('UPDATE_ROOM')
  async handleUpdateRoom(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: { room: RoomData; newRoom: RoomData },
  ) {
    try {
      console.log('UPDATE_ROOM:', payload);
      const nameExists = await this.prismaService.chatroom.findFirst({
        where: { name: payload.newRoom.roomInfos.name },
      });
      if (nameExists) {
        console.log('nameExists:', nameExists);
        throw 'Room name already exists';
      }
      await this.prismaService.chatroom.update({
        where: { id: payload.room.roomInfos.id },
        data: {
          name: payload.newRoom.roomInfos.name,
          chatroomType: payload.newRoom.roomInfos.roomType as TYPE,
          password: payload.newRoom.password,
        },
      });
      this.server
        .to(payload.room.roomInfos.id)
        .emit('UPDATE_ROOM', payload.newRoom);
    } catch (error) {
      console.error('Error updating room:', error);
    }
  }

  @SubscribeMessage('MUTE_USER')
  async handleMuteUser(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: { roomId: string; mutedUser: string; muterId: string },
  ) {
    try {
      if (payload.muterId !== client.userId) throw UnauthorizedException;
      console.log('MUTE_USER:', payload);
      const userToMute = await this.prismaService.chatroomUser.findFirst({
        where: { chatroomId: payload.roomId, userId: payload.mutedUser },
      });

      await this.prismaService.chatroomUser.update({
        where: { id: userToMute.id },
        data: { restriction: 'MUTED' },
      });
      this.server
        .to(payload.roomId)
        .emit('MUTE_USER', payload.roomId, payload.mutedUser);
    } catch (error) {
      console.error('Error muting user:', error);
    }
  }

  @SubscribeMessage('UNMUTE_USER')
  async handleUnMuteUser(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: { roomId: string; mutedUser: string; muterId: string },
  ) {
    try {
      if (payload.muterId !== client.userId) throw UnauthorizedException;
      const userToMute = await this.prismaService.chatroomUser.findFirst({
        where: { chatroomId: payload.roomId, userId: payload.mutedUser },
      });

      await this.prismaService.chatroomUser.update({
        where: { id: userToMute.id },
        data: { restriction: 'NONE' },
      });
      this.server
        .to(payload.roomId)
        .emit('UNMUTE_USER', payload.roomId, payload.mutedUser);
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
}
