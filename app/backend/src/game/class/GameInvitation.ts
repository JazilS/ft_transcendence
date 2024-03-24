import { PongGameType } from 'shared/constant';

export const GAME_INVITATION_TIME_LIMIT = 10;

export class GameInvitation {
  private readonly id: string;
  private readonly invitedUserId: string;
  private readonly gameId: string;
  private readonly socketId: string;
  private readonly date: Date;
  private readonly pongType: PongGameType;

  constructor(
    id: string,
    gameId: string,
    invitedUserId: string,
    socketId: string,
    pongType: PongGameType,
  ) {
    this.id = id;
    this.gameId = gameId;
    this.invitedUserId = invitedUserId;
    this.socketId = socketId;
    this.pongType = pongType;
  }

  get getSenderId() {
    return this.id;
  }

  get getInvitedUserId() {
    return this.invitedUserId;
  }

  get getGameId() {
    return this.gameId;
  }

  get getPongType() {
    return this.pongType;
  }

  get getSocketId() {
    return this.socketId;
  }

  get hasExpired(): number {
    const now = new Date();
    const diff = Math.round(
      Math.abs(this.date.getTime() - now.getTime()) / 1000,
    );

    if (diff >= GAME_INVITATION_TIME_LIMIT) {
      return 0;
    }

    return GAME_INVITATION_TIME_LIMIT - diff;
  }
}
