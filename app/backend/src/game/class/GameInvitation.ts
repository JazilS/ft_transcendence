export const GAME_INVITATION_TIME_LIMIT = 10;

export class GameInvitation {
  private readonly id: string;
  private readonly invitedUserId: string;
  private readonly gameId: string;
  private readonly socketId: string;
  private readonly date: Date;

  constructor(
    id: string,
    gameId: string,
    invitedUserId: string,
    socketId: string,
  ) {
    this.id = id;
    this.gameId = gameId;
    this.invitedUserId = invitedUserId;
    this.socketId = socketId;
  }

  getSenderId() {
    return this.id;
  }

  getInvitedUserId() {
    return this.invitedUserId;
  }

  getGameId() {
    return this.gameId;
  }

  getSocketId() {
    return this.socketId;
  }

  hasExpired(): number {
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
