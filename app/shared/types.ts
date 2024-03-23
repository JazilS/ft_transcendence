export type StartGameInfo = {
  room: string;
  creator: PlayerStartGameInfo;
  opponent: PlayerStartGameInfo;
};

export type PlayerStartGameInfo = {
  id?: string;
  nickname: string;
  avatar: string | undefined;
  socketId?: string;
};

export type Coordinate = {
  x: number;
  y: number;
};

export type Dimension = {
  height: number;
  width: number;
};

export type Velocity = {
  x: number;
  y: number;
};
