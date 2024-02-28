import User  from '../User/UserModel';
import PlayerProfile from '../User/PlayerProfile/PlayerProfile';

export interface Lobby {
	id: string | undefined;
	user: PlayerProfile | undefined;
	opponent: PlayerProfile | undefined;
	status: boolean;
}

export interface Game {
	id : string 
	players : PlayerProfile[]
	winner  : string
	board   : string
	// a modifier
}