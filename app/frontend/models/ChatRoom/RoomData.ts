import { ChatMemberProfile } from "./ChatMemberProfile";
import ChatRoom from "./ChatRoomModel";
import Messages from "./messages";

export default interface RoomData {
  roomInfos: { id: string; name: string; roomType: string };
  users: ChatMemberProfile[];
  messages: Messages[];
  password?: string;
}
