import { Player } from "./Player";
import { Coordinate, Velocity } from "./types";
import {
  BALL_HALF_HEIGHT,
  BALL_HALF_WIDTH,
  BALL_VELOCITY,
  BALL_X_POSITION,
  Ball_Y_POSITION,
  PADDLE_HALF_HEIGHT,
  PADDLE_HALF_WIDTH,
  PADDLE_MARGIN_X,
  PADDLE_WIDTH,
  SPEED_FACTOR,
} from "./constant";
import { sign } from "./utils";

export class Ball {
  private position: Coordinate;
  private radius: number;
  private velocity: Velocity;
  private width: number;

  constructor(position: Coordinate, radius: number, velocity: Velocity) {
    this.position = position;
    this.radius = radius;
    this.velocity = velocity;
    this.width = radius * 2;
  }

  public Draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.stroke();
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  public resetBall() {
    this.position = { x: BALL_X_POSITION, y: Ball_Y_POSITION };
    this.velocity = {
      x: Math.random() < 0.5 ? -BALL_VELOCITY : BALL_VELOCITY,
      y: Math.random() < 0.5 ? -BALL_VELOCITY : BALL_VELOCITY,
    };
  }

  reverseX() {
    this.velocity.x += sign(this.velocity.x) * SPEED_FACTOR;
    this.velocity.x *= -1;
  }

  reverseY() {
    this.velocity.y *= -1;
  }

  get getWidth(): number {
    return this.width;
  }

  get getPosition(): Coordinate {
    return this.position;
  }

  get getVelocity(): Velocity {
    return this.velocity;
  }

  private isCollidingWithPaddle1(player: Player) {
    const collidesX =
      this.position.x <= PADDLE_MARGIN_X + PADDLE_WIDTH + BALL_HALF_WIDTH &&
      this.position.x >= PADDLE_HALF_WIDTH + PADDLE_MARGIN_X;
    const collidesY =
      this.position.y >
        player.getPosition.y - PADDLE_HALF_HEIGHT - BALL_HALF_HEIGHT &&
      this.position.y <
        player.getPosition.y + PADDLE_HALF_HEIGHT + BALL_HALF_HEIGHT;
    if (collidesX && collidesY) {
      this.position.x = PADDLE_MARGIN_X + PADDLE_WIDTH + BALL_HALF_WIDTH;
      this.reverseX();
    }
  }

  private isCollidingWithPaddle2(player: Player) {
    const collidesX =
      this.position.x >=
        1 - (PADDLE_MARGIN_X + PADDLE_WIDTH + BALL_HALF_WIDTH) &&
      this.position.x <= 1 - PADDLE_HALF_WIDTH + PADDLE_MARGIN_X;
    const collidesY =
      this.position.y >
        player.getPosition.y - PADDLE_HALF_HEIGHT - BALL_HALF_HEIGHT &&
      this.position.y <
        player.getPosition.y + PADDLE_HALF_HEIGHT + BALL_HALF_HEIGHT;
    if (collidesX && collidesY) {
      this.position.x = 1 - (PADDLE_MARGIN_X + PADDLE_WIDTH + BALL_HALF_WIDTH);
      this.reverseX();
    }
  }

  public update(player1: Player, player2: Player, dt: number) {
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

	if (this.position.y - BALL_HALF_HEIGHT < 0) {
	  this.position.y = BALL_HALF_HEIGHT;
	  this.reverseY();
	}

	if (this.position.y + BALL_HALF_HEIGHT >= 1) {
	  this.position.y = 1 - BALL_HALF_HEIGHT;
	  this.reverseY();
	}

	if (this.position.x - BALL_HALF_WIDTH <= 0) {
		player2.increaseScore();
		this.resetBall();
	}

	if (this.position.x + BALL_HALF_WIDTH >= 1) {
		player1.increaseScore();
		this.resetBall();
	}
	this.isCollidingWithPaddle1(player1);
	this.isCollidingWithPaddle2(player2);

	return { player1Score: player1.getScore, player2Score: player2.getScore };
	}
}
