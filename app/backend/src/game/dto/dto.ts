import { PongEvent } from '../../../shared/socketEvent';
import { pongType, PongGameType } from '../class/InterfaceGame';
import { IsEnum, IsIn, IsNotEmpty, IsString } from 'class-validator';

enum Position {
  ARROW_UP = PongEvent.ARROW_UP,
  ARROW_DOWN = PongEvent.ARROW_DOWN,
}

export class updatePlayerPositionDto {
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @IsString()
  @IsEnum(Position)
  keyPressed: Position;
}


export class PongGameTypeDto {
  @IsIn(pongType)
  pongType: PongGameType;
}

export class GameIdDto {
  @IsString()
  @IsNotEmpty()
  gameId: string;
}

export class GameInvitationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsIn(pongType)
  pongType: PongGameType;
}