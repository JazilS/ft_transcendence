import Messages from './Message.types';

export interface FadeMenuInfos {
  isFriend: boolean;
  isConnected: boolean;
  isInvited: boolean;
  isBlocked: boolean;
  isMuted: boolean;
  isKicked: boolean;
  isBanned: boolean;
  role: string;
}

export interface PlayerProfile {
  id: string;
  name: string | undefined;
  imageSrc: string | undefined;
}

export interface ChatMemberProfile {
  userProfile: PlayerProfile;
  role: string;
  fadeMenuInfos: FadeMenuInfos;
}

export default interface RoomData {
  roomInfos: { id: string; name: string; roomType: string };
  users: ChatMemberProfile[];
  messages: Messages[];
  password?: string;
}
