import { IPongGame } from './InterfaceGame';
import { Player } from '../../../../shared/Player';
import {
  defaultPlayer,
  defaultOpponentPlayer,
  defaultBall,
} from '../../../../shared/constant';
import { Ball } from '../../../../shared/Ball';

export class PongGame extends IPongGame {
  private ball: Ball;
  constructor(gameId: string, playerId: string, socketId: string) {
    super();
    this.setGameId = gameId;
    this.setPlayer = new Player(
      {
        width: defaultPlayer.paddleWidth,
        height: defaultPlayer.paddleHeight,
      },
      {
        x: defaultPlayer.xPosition,
        y: defaultPlayer.yPosition,
      },
      {
        x: defaultPlayer.speed,
        y: defaultPlayer.speed,
      },
      playerId,
    );
    this.setOpponentPlayer = new Player(
      {
        width: defaultOpponentPlayer.paddleWidth,
        height: defaultOpponentPlayer.paddleHeight,
      },
      {
        x: defaultOpponentPlayer.xPosition,
        y: defaultOpponentPlayer.yPosition,
      },
      {
        x: defaultOpponentPlayer.speed,
        y: defaultOpponentPlayer.speed,
      },
    );
    this.setBall = new Ball(
      {
        x: defaultBall.speed,
        y: defaultBall.speed,
      },
      defaultBall.radius,
      {
        x: defaultBall.xPosition,
        y: defaultBall.yPosition,
      },
    );
    this.addNewPlayer(playerId);
    this.addNewSocket(socketId);
  }

  set setBall(ball: Ball) {
    this.ball = ball;
  }

  get getBall() {
    return this.ball;
  }

  public update() {
    const now = performance.now();
    const dt = this.getLastTime === -1 ? 1000 / 60 : now - this.getLastTime;
    const score = this.getBall.update(
      this.getPlayer,
      this.getOppenentPlayer,
      dt,
    );

    if (this.getPlayer.getScore !== score.player1Score)
      this.getPlayer.increaseScore();
    if (this.getOppenentPlayer.getScore !== score.player2Score)
      this.getOppenentPlayer.increaseScore();

    this.getPlayer.updatePosition(dt);
    this.getOppenentPlayer.updatePosition(dt);
    this.isAWinnerOrTimeExceeded();
    this.setLastTime = now;
  }

  public getUpdatedData() {
    return {
      player1: {
        ...this.getPlayer.getPosition,
        score: this.getPlayer.getScore,
        id: this.getPlayer.getPlayerId,
      },
      player2: {
        ...this.getOppenentPlayer.getPosition,
        score: this.getOppenentPlayer.getScore,
        id: this.getOppenentPlayer.getPlayerId,
      },
      coordinates: [this.getBall.getPosition],
    };
  }

  public getEndGameData() {
    return {
      winner: {
        id: this.getWinner.getPlayerId,
        score: this.getWinner.getScore,
      },
      loser: {
        id: this.getLoser.getPlayerId,
        score: this.getLoser.getScore,
      },
    };
  }
}
