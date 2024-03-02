import { Coordinate, Dimension, Velocity } from "./types";
import { clamp } from "./utils";
import {
  PADDLE_MAX_Y_POS,
  PADDLE_MIN_Y_POS,
  keyPressedType,
  ArrowUp,
  ArrowDown,
} from "./constant";

export enum KeyboardEvent {
  ARROW_UP = ArrowUp,
  ARROW_DOWN = ArrowDown,
}

export class Player {
  private id: string;
  private position: Coordinate;
  private dimension: Dimension;
  private velocity: Velocity;
  private score: number;
  private moveUp: boolean;
  private moveDown: boolean;

  constructor(
    id: string,
    position: Coordinate,
    dimension: Dimension,
    velocity: Velocity
  ) {
    this.id = id as string;
    this.position = position;
    this.dimension = dimension;
    this.velocity = velocity;
    this.score = 0;
  }

  public updatePosition(dt: number) {
    if (this.moveUp) {
      this.position.y -= this.velocity.y * dt;
    }
    if (this.moveDown) {
      this.position.y += this.velocity.y * dt;
    }
    this.position.y = clamp(
      this.position.y,
      PADDLE_MIN_Y_POS,
      PADDLE_MAX_Y_POS
    );
  }

  set setYPosition(y: number) {
    this.position.y = y;
  }

  set setXPosition(x: number) {
    this.position.x = x;
  }

  set setId(id: string) {
    this.id = id;
  }

  get getPosition() {
    return this.position;
  }

  get getDimension(): Dimension {
    return this.dimension;
  }

  get getScore(): number {
    return this.score;
  }

  get getPlayerId(): string {
    return this.id;
  }

  public getHalfWidth() {
    return this.dimension.width / 2;
  }

  public getHalfHeight() {
    return this.dimension.height / 2;
  }

  public clearMoves(direction: keyPressedType) {
    if (direction === KeyboardEvent.ARROW_UP) {
      this.moveUp = false;
      return;
    }
    this.moveDown = false;
  }

  public setMoves(direction: keyPressedType) {
    if (direction === KeyboardEvent.ARROW_UP) {
      this.moveUp = true;
      return;
    }
    this.moveDown = true;
  }

  public getCenter(): Coordinate {
    return {
      x: this.position.x + this.getHalfWidth(),
      y: this.position.y + this.getHalfHeight(),
    };
  }

  public increaseScore() {
    this.score++;
  }
}
