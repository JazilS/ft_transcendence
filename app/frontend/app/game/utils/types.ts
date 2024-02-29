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