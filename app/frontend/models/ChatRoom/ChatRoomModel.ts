import Messages from "./messages";

export default interface ChatRoom {
  error: any;
  id: string;
  name: string;
  roomType: string;
  users: string[];
  messages: Messages[];
}
