import GameHistory from '../GameHistory/gameHistory';
import ChatRoom from '../ChatRoom/ChatRoomModel';
import PlayerProfile from './PlayerProfile/PlayerProfile';

export default interface User {
	playerProfile: PlayerProfile;
	channelsIn: ChatRoom[];
	isConnected: boolean;
	isReadyLobby: boolean;
	// Ajoutez d'autres propriétés ici si nécessaire
  }