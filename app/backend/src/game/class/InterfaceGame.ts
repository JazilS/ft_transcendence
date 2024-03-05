import { Player } from '../../../../shared/Player';

export const PongTypeNormal = 'NORMAL';
export const pongType = [PongTypeNormal] as const;
export type PongGameType = (typeof pongType)[number];
export const scoreToWinPongGame = 5;
export const pongGameDuration = 15;

export abstract class IPongGame {
  private player: Player;
  private oppenentPlayer: Player;
  private winner: Player | undefined = undefined;
  private loser: Player | undefined = undefined;
  private activate: boolean;
  private gameId: string;
  private players: string[] = [];
  private socketId: string[] = [];
  private startGameTime: Date;
  private endGame: Date;
  private gameStarted: boolean;
  private gameTimeExceeded: boolean = false;
  private draw: boolean = false;
  private lastTime: number = -1;
  private toWin: number;

  constructor() {
    this.toWin = scoreToWinPongGame;
  }

  public abstract update(): void;

  public abstract getUpdatedData(): unknown;

  public abstract getEndGameData(): unknown;

  public isAWinnerOrTimeExceeded(): void {
    if (this.getPlayer.getScore >= this.toWin) {
      this.setWinner = this.getPlayer;
      this.setLoser = this.getOppenentPlayer;
    }
    if (this.getOppenentPlayer.getScore >= this.toWin) {
      this.setWinner = this.getOppenentPlayer;
      this.setLoser = this.getPlayer;
    }

    const now = new Date();
    if (now >= this.endGame) {
      this.gameTimeExceeded = true;
      if (this.getPlayer.getScore >= this.toWin) {
        this.setWinner = this.getPlayer;
        this.setLoser = this.getOppenentPlayer;
      }
      if (this.getOppenentPlayer.getScore >= this.toWin) {
        this.setWinner = this.getOppenentPlayer;
        this.setLoser = this.getPlayer;
      }

      this.draw = true;
    }
  }

  public startGame() {
    this.gameStarted = true;
    this.startGameTime = new Date();
    this.endGame = new Date(
      this.startGameTime.getTime() + pongGameDuration * 60000,
    );
  }

  public addNewPlayer(playerid: string) {
    this.players.push(playerid);
  }

  public addNewSocket(socketid: string) {
    this.socketId.push(socketid);
  }

  public removePlayer(userId: string) {
    this.players = this.players.filter((playerid) => playerid !== userId);
  }

  get getPlayer(): Player {
    return this.player;
  }

  set setWinner(player: Player) {
    this.winner = player;
  }

  set setLoser(player: Player) {
    this.loser = player;
  }

  get getOppenentPlayer(): Player {
    return this.oppenentPlayer;
  }
}
