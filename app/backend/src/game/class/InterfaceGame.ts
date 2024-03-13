import { Player } from '../../../../shared/Player';
import { keyPressedType } from '../../../../shared/constant';

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
  private endTime: Date;
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
    if (now >= this.endTime) {
      this.gameTimeExceeded = true;
      if (this.getPlayer.getScore >= this.toWin) {
        this.setWinner = this.getPlayer;
        this.setLoser = this.getOppenentPlayer;
      }
      if (this.getOppenentPlayer.getScore >= this.toWin) {
        this.setWinner = this.getOppenentPlayer;
        this.setLoser = this.getPlayer;
      }

      this.setDraw = true;
    }
  }

  public startGame() {
    this.gameStarted = true;
    this.startGameTime = new Date();
    this.endTime = new Date(
      this.startGameTime.getTime() + pongGameDuration * 60000,
    );
  }

  public addNewPlayer(playerid: string) {
    this.players.push(playerid);
  }

  public removePlayer(userId: string) {
    this.players = this.players.filter((playerid) => playerid !== userId);
  }
  public addNewSocket(socketid: string) {
    this.socketId.push(socketid);
  }

  public endGame(): boolean {
    if (this.getWinner || this.getGameTimeExceeded) {
      return true;
    }
    return false;
  }

  public updatePlayerPosition(userId: string, move: keyPressedType) {
    if (this.player.getPlayerId === userId) {
      this.player.setMoves(move);
    } else {
      this.getOppenentPlayer.setMoves(move);
    }
  }

  public stopUpdatePlayerPosition(userId: string, move: keyPressedType) {
    if (this.player.getPlayerId === userId) {
      this.player.clearMoves(move);
    } else {
      this.getOppenentPlayer.clearMoves(move);
    }
  }

  get getSocketId(): string[] {
    return this.socketId;
  }

  set setOpponentPlayerId(playerId: string) {
    this.addNewPlayer(playerId);
    this.getOppenentPlayer.setId = playerId;
  }
  get getPlayers(): string[] {
    return this.players;
  }

  get numberOfPlayers(): number {
    return this.players.length;
  }
  set setGameId(gameId: string) {
    this.gameId = gameId;
  }

  get getGameId(): string {
    return this.gameId;
  }

  set setWinner(player: Player) {
    this.winner = player;
  }

  get getWinner(): Player | undefined {
    return this.winner;
  }

  set setLoser(player: Player) {
    this.loser = player;
  }

  get getLoser(): Player | undefined {
    return this.loser;
  }

  set setDraw(draw: boolean) {
    this.draw = draw;
  }

  get getDraw(): boolean {
    return this.draw;
  }

  set setOpponentPlayer(player: Player) {
    this.oppenentPlayer = player;
  }

  get getOppenentPlayer(): Player {
    return this.oppenentPlayer;
  }

  set setPlayer(player: Player) {
    this.player = player;
  }

  get getPlayer(): Player {
    return this.player;
  }

  set setLastTime(lastTime: number) {
    this.lastTime = lastTime;
  }

  get getLastTime(): number {
    return this.lastTime;
  }

  set setActivate(activate: boolean) {
    this.activate = activate;
  }

  get getActivate(): boolean {
    return this.activate;
  }

  set setGameStarted(gameStarted: boolean) {
    this.gameStarted = gameStarted;
  }

  get getGameStarted(): boolean {
    return this.gameStarted;
  }

  set setGameTimeExceeded(gameTimeExceeded: boolean) {
    this.gameTimeExceeded = gameTimeExceeded;
  }

  get getGameTimeExceeded(): boolean {
    return this.gameTimeExceeded;
  }
}
