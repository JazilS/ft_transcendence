//MACRO
export const GAME_MARGIN = 15;
export const ASPECT_RATIO = 286 / 175;
export const PADDLE_MARGIN_X = 0.01;
export const PADDLE_MARGIN_Y = PADDLE_MARGIN_X * ASPECT_RATIO;
export const PADDLE_HEIGHT = 0.16;
export const PADDLE_MIN_Y_POS = PADDLE_MARGIN_Y + PADDLE_HEIGHT / 2;
export const PADDLE_MAX_Y_POS = 1 - PADDLE_MIN_Y_POS;
export const ArrowUp = 'ArrowUp';
export const ArrowDown = 'ArrowDown';

//TYPES
export type gameStatus = 'NOT_STARTED' | 'STARTED' | 'IN_PROGRESS' | 'FINISHED';
export type keyPressedType = "ArrowUp" | "ArrowDown";
