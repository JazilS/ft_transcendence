import User  from '../User/UserModel';
import PlayerProfile from '../User/PlayerProfile/PlayerProfile';

export interface Lobby {
	id: string | undefined;
	user: PlayerProfile | undefined;
	opponent: PlayerProfile | undefined;
	status: boolean;
}

export interface Game {
	id: string | undefined;
	user: User | undefined;
	opponent: User | undefined;
	// a modifier
}