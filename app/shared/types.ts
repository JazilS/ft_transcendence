export type StartGameInfo = {
  room: string | undefined;
  creator: PlayerStartGameInfo;
  opponent: PlayerStartGameInfo;
};

export type PlayerStartGameInfo = {
  id?: string;
  name: string;
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

export type PlayerData = { id: string; score: number } & Coordinate;

export type UpdatedGameData = {
  player1: PlayerData;
  player2: PlayerData;
  coordinates: Coordinate[];
};
