import Messages from "./messages";

export default interface ChatRoom {
  id: string;
  name: string;
  roomType: string;
  users: string[];
  messages: Messages[];
}
