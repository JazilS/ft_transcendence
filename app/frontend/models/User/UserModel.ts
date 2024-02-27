import GameHistory from '../GameHistory/gameHistory';
import ChatRoom from '../ChatRoom/ChatRoomModel';
import PlayerProfile from './PlayerProfile/PlayerProfile';

export default interface User {
	playerProfile: PlayerProfile;
	channelsIn: ChatRoom[];
	isConnected: boolean;
	isReadyLobby: boolean;
	access_toekn: string;
	// Ajoutez d'autres propriétés ici si nécessaire
  }