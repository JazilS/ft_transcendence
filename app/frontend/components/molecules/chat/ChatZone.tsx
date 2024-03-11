import MessagesDisplay from "@/components/atom/chat/MessagesDisplay";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import Messages from "@/models/ChatRoom/messages";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export default function ChatZone({ roomOn }: { roomOn: ChatRoom | undefined }) {
  const [socket, setSocket] = useState<Socket>();
  const [value, setValue] = useState<string>("");
  const messages = roomOn?.messages || [];
  const channelName = roomOn?.name || "Not in a channel";


  return (
    <div className="h-full w-[60%] p-2 flex flex-col items-center">
      <h1 className="text-4xl text-white ">{channelName}</h1>
      <MessagesDisplay messages={messages} />
      <input
        type="text"
        value={value}
        placeholder="chat"
        className="w-[85%] h-10 mt-7 p-2 rounded-3xl text-lg bg-white bg-opacity-80 placeholder:text-gray-700 placeholder:text-lg indent-2"
        onChange={(e) => setValue((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // sendMessage((e.target as HTMLInputElement).value);
            setValue("");
          }
        }}
      />
    </div>
  );
}
