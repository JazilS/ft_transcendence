import ChatRoom from '../ChatRoom/ChatRoomModel';
import PlayerProfile from './PlayerProfile/PlayerProfile';

export default interface User {
	playerProfile: PlayerProfile;
	channelsIn: ChatRoom[];
	friends: {id: string, name: string, roomId: string}[];
	isConnected: boolean;
	isReadyLobby: boolean;
	access_token: string;
	// Ajoutez d'autres propriétés ici si nécessaire
  }