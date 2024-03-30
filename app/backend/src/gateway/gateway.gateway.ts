import {
  ConnectedSocket,
  MessageBody,
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
import { ChatroomUser, TYPE, User } from '@prisma/client';
import RoomData from './types/RoomData.types';
import { UserService } from 'src/user/user.service';
import { UserData } from '../types/userInfo';
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
import { GAME_INVITATION_TIME_LIMIT } from 'src/game/class/GameInvitation';
import { UserIdDto } from 'src/user/dto/dto';
import { ChatService } from 'src/chat/chat.service';

@WebSocketGateway()
// implements OnGatewayConnection, OnGatewayDisconnect
export class GatewayGateway {
  constructor(
    private readonly pongService: GameService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly gameService: GameService,
    private readonly libService: LibService,
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

  @SubscribeMessage('SET_DM_CHATROOM')
  async handleSetDmRoom(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: { friendId: string; friendName: string; roomId: string },
  ) {
    try {
      console.log('SET_DM_CHATROOM:', payload);
      if (!payload.roomId || payload.roomId === '') {
        const chatroom = await this.prismaService.chatroom.create({
          data: {
            name: payload.friendId.slice(0, 5) + client.userId.slice(0, 5),
            chatroomType: 'DM',
            users: {
              createMany: {
                data: [
                  {
                    userId: client.userId,
                    role: 'MEMBER',
                    restriction: 'NONE',
                  },
                  {
                    userId: payload.friendId,
                    role: 'MEMBER',
                    restriction: 'NONE',
                  },
                ],
              },
            },
          },
        });
        console.log('CREATE_DM_CHATROOM:', chatroom);
        client.join(chatroom.id);
        const { sockets } = this.server.sockets;
        Object.values(sockets).forEach((socket: SocketWithAuth) => {
          if (socket.userId === payload.friendId) {
            socket.join(chatroom.id);
            console.log('Friend joined room:', chatroom.id);
          }
        });
        this.server.to(client.userId).emit('SET_DM_CHATROOM', chatroom.id);
        this.server
          .to(payload.friendId)
          .emit('CREATE_DM_CHATROOM', client.userId, chatroom.id);
        return;
      }
      this.handleJoinSocketRoom(client, { room: payload.roomId });
      this.server.to(client.userId).emit('SET_DM_CHATROOM', payload.roomId);
    } catch (error) {
      console.error('Error creating DM room:', error);
    }
  }

  // JOIN_SOCKET_ROOM
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

        try {
          client.to(payload.room).emit(
            'JOIN_ROOM',
            {
              userProfile: userProfile,
              role: userRole.role as string,
              fadeMenuInfos: await this.userService.getFadeMenuInfos(
                client.userId,
                payload.userId,
                payload.room,
              ),
            },
            payload.room,
          );
        } catch (error) {
          console.error('Error joining room:', error);
        }
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
    let canLeave: boolean = false;
    if (!payload.room || payload.room === '') throw 'No room provided';
    if (!payload.userId || payload.userId === '') throw 'No userId provided';
    if (!payload.leavingType || payload.leavingType === '')
      throw 'No leavingType provided';
    if (payload.leavingType === 'LEAVING') payload.userId = emitter.userId;
    if (payload.leavingType === 'LEAVING' && emitter.userId !== payload.userId)
      throw 'Unauthorized';

    console.log('userId  = ', payload.userId);
    console.log('room = ', payload.room);
    const roomExists = await this.prismaService.chatroom.findUnique({
      where: { id: payload.room },
    });
    if (!roomExists) {
      return;
    }
    const userInChatroom = await this.prismaService.chatroomUser.findFirst({
      where: { chatroomId: payload.room, userId: payload.userId },
    });
    console.log('userInchatroom : ', userInChatroom);
    if (userInChatroom)
      await this.prismaService.chatroomUser.delete({
        where: { id: userInChatroom.id },
      });

    if (payload.leavingType === 'LEAVING') {
      emitter.leave(payload.room);
    } else {
      if (payload.leavingType !== 'LEAVING') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, socket] of this.server.of('/').sockets) {
          const client = socket as SocketWithAuth;
          if (client.userId === payload.userId) {
            client.leave(payload.room);
            break;
          }
        }
      }
    }

    this.userService.leaveChatroom({
      userId: payload.userId,
      roomId: payload.room,
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

    // const clientsInRoom = await this.server.in(payload.room).fetchSockets();
    // // If the room is empty, delete it from the database
    // if (clientsInRoom.length === 0) {
    //   // Delete all messages associated with the room
    //   console.log('Room is empty, deleting room:', payload.room);
    //   try {
    //     await this.prismaService.message.deleteMany({
    //       where: { chatId: payload.room },
    //     });
    //   } catch (error) {
    //     console.error('Error deletidng messages:', error);
    //     throw error;
    //   }

    // Then delete the room
    //   try {
    //     await this.prismaService.chatroom.delete({
    //       where: { id: payload.room },
    //     });
    //   } catch (error) {
    //     console.error(
    //       'Error deleting room:',
    //       error,
    //       await this.prismaService.chatroom.findFirst({
    //         where: { id: payload.room },
    //       }),
    //     );
    //   }
    //   // return;
    // }
    if (payload.leavingType === 'KICKED' || payload.leavingType === 'BANNED')
      this.server
        .to(payload.userId)
        .emit('LEAVE_ROOM', payload.userId, payload.leavingType);
    this.server
      .to(payload.room)
      .emit('UPDATE_CHAT_MEMBERS', payload.userId, payload.room);

    return 'Left room : ' + payload.room;
  }
  //-----------------------------------------------------------------------------------------------------------------
  @Interval(FRAME_RATE)
  async updateGame() {
    this.gameService.gameUpdate(this.server);
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
      // this.handleMessage({ message: blockedMessage }, client);
      this.server.to(payload.blockedUserId).emit('MESSAGE', blockedMessage);
    } catch (error) {
      console.error('Error blocking user:', error);
    }
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
        throw new WsUnknownException(`${user.name} is currently not online`);
      }

      await this.pongService.joinGame(
        this.server,
        room,
        {
          creator: creator,
          opponent: {
            name: user.name,
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
      }),
      this.userService.findUserById(id, UserData),
    ]);

    if (!me || !user) throw new WsUserNotFoundException();

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
      message: `Game invitation succesfully sent to ${user.name}`,
    });

    this.libService.sendToSocket(
      this.server,
      id,
      PongEvent.RECEIVE_GAME_INVITATION,
      {
        message: `${me.name} invited you to a play ${
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
      throw new WsUnknownException(`${user.name} is currently not online`);
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
        creator: { name: user.name, avatar: user.profile.avatar },
        opponent: { name: me.name, avatar: me.profile.avatar },
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
          message: `${me.name} declined your invitation`,
          severity: 'info',
        },
      );
    }
    this.libService.sendToSocket(this.server, userId, GeneralEvent.SUCCESS);
  }

  // private getAllSockeIdsByKey(key: string) {
  //   return this.server.of('/').adapter.rooms.get(key);
  // }

  // PROMOTE_USER
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
      this.server
        .to(payload.roomOnId)
        .emit('PROMOTE_USER', payload.targetId, payload.roomOnId);
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

  @SubscribeMessage('ADD_FRIEND')
  async handleAddFriend(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: {
      userId: string;
      userName: string;
      targetId: string;
      targetName: string;
      dmRoom: string;
    },
  ) {
    try {
      this.server
        .to(payload.userId)
        .emit('ADD_FRIEND', payload.targetId, payload.targetName);
      this.server
        .to(payload.targetId)
        .emit('ADD_FRIEND', payload.userId, payload.userName);
    } catch (error) {
      console.error('Error adding user as friend:', error);
    }
  }

  @SubscribeMessage('REMOVE_FRIEND')
  async handleRemoveFriend(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    payload: {
      userId: string;
      userName: string;
      targetId: string;
      targetName: string;
    },
  ) {
    try {
      const room = await this.prismaService.chatroom.findFirst({
        where: {
          chatroomType: 'DM',
          users: {
            every: {
              OR: [{ userId: payload.userId }, { userId: payload.targetId }],
            },
          },
        },
      });
      let roomId: string;

      if (room) {
        console.log('CWCWCWWWWWWWWWWWWWWWWWWWCCCWWCWCWCWCWCWCW ROOOM:', room);
        // const { sockets } = this.server.sockets;
        // let targetSocket: SocketWithAuth;
        // for (const id in sockets) {
        //   const socket = sockets[id] as SocketWithAuth;
        //   if (socket.userId === payload.targetId) {
        //     targetSocket = socket;
        //   }
        // }
        // await this.handleLeaveRoom(
        //   {
        //     room: room.id,
        //     userName: payload.userName,
        //     userId: payload.userId,
        //     leavingType: 'LEAVING',
        //   },
        //   client,
        // );
        // console.log(
        //   'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBREMOVE_FRIEND:',
        //   targetSocket,
        // );
        // await this.handleLeaveRoom(
        //   {
        //     room: room.id,
        //     userName: payload.targetName,
        //     userId: payload.targetId,
        //     leavingType: 'LEAVING',
        //   },
        //   targetSocket,
        // );
        roomId = room.id;
      } else roomId = '';
      this.server
        .to(payload.userId)
        .emit('REMOVE_FRIEND', payload.targetId, roomId);
      const room2 = await this.prismaService.chatroom.findFirst({
        where: {
          chatroomType: 'DM',
          users: {
            every: {
              OR: [{ userId: payload.userId }, { userId: payload.targetId }],
            },
          },
        },
      });
      this.server
        .to(payload.targetId)
        .emit('REMOVE_FRIEND', payload.userId, room2.id);
    } catch (error) {
      console.error('Error removing user from friends:', error);
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
