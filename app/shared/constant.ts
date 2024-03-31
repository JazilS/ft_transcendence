//MACRO
export const GAME_MARGIN = 15;
export const PADDLE_WIDTH = 0.015;
export const ASPECT_RATIO = 286 / 175;
export const PADDLE_MARGIN_X = 0.01;
export const PADDLE_MARGIN_Y = PADDLE_MARGIN_X * ASPECT_RATIO;
export const PADDLE_HEIGHT = 0.16;
export const PADDLE_MIN_Y_POS = PADDLE_MARGIN_Y + PADDLE_HEIGHT / 2;
export const PADDLE_MAX_Y_POS = 1 - PADDLE_MIN_Y_POS;
export const ArrowUp = "ArrowUp";
export const ArrowDown = "ArrowDown";
export const PLAYER_SPEED = 0.0013;
export const PADDLE_HALF_HEIGHT = PADDLE_HEIGHT / 2;
export const PADDLE_HALF_WIDTH = PADDLE_WIDTH / 2;
export const MAX_DATE = '9999-12-31T23:59:59.999Z';
export const FRAME_RATE = 1000 / 60;

//TYPES
export type gameStatus = "NOT_STARTED" | "STARTED" | "IN_PROGRESS" | "FINISHED";
export type keyPressedType = "ArrowUp" | "ArrowDown";
export const PongTypeNormal = 'NORMAL';
export const PongTypeSpecial = 'SPECIAL';
export const pongType = [PongTypeNormal, PongTypeSpecial] as const;
export type PongGameType = (typeof pongType)[number];
export const scoreToWinPongGame = 11;
export const pongGameDuration = 15;

export const defaultPlayer = {
  paddleWidth: PADDLE_WIDTH,
  paddleHeight: PADDLE_HEIGHT,
  xPosition: PADDLE_MARGIN_X + PADDLE_WIDTH / 2,
  yPosition: 0.5,
  speed: PLAYER_SPEED,
};

export const defaultOpponentPlayer = {
  paddleWidth: PADDLE_WIDTH,
  paddleHeight: PADDLE_HEIGHT,
  xPosition: 1 - defaultPlayer.xPosition,
  yPosition: 0.5,
  speed: PLAYER_SPEED,
};

export const BALL_X_POSITION = 0.5;
export const Ball_Y_POSITION = 0.5;
export const BALL_VELOCITY = 0.0007;
export const SPEED_FACTOR = BALL_VELOCITY / 20;
export const RESIZE_FACTOR = 1.3;
export const BALL_HALF_WIDTH = 0.009;
export const BALL_HALF_HEIGHT = BALL_HALF_WIDTH * ASPECT_RATIO;

export const defaultBall = {
  speed: BALL_VELOCITY,
  radius: 0.05,
  xPosition: 0.5,
  yPosition: 0.5,
};
