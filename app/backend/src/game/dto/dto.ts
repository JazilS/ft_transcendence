import { PongEvent } from '../../../shared/socketEvent';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum Position {
  ARROW_UP = PongEvent.ARROW_UP,
  ARROW_DOWN = PongEvent.ARROW_DOWN,
}

export class updatePlayerPosition {
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @IsString()
  @IsEnum(Position)
  keyPressed: Position;
}
