import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { mySocket } from "@/app/utils/getSocket";
import MessagesDisplay from "@/components/atom/chat/MessagesDisplay";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import Messages from "@/models/ChatRoom/messages";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  useAddMessageMutation,
  useGetMessagesFromRoomMutation,
} from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";

export default function ChatZone({ roomOn }: { roomOn: ChatRoom | undefined }) {
  const [socket, setSocket] = useState<Socket>();
  const [content, setContent] = useState<string>("");
  const [messages, setMessages] = useState<Messages[]>([]);
  // const [receivedMessage, setReceivedMessage] = useState<Messages>();
  const channelName = roomOn?.name || "Not in a channel";
  const user: PlayerProfile = useAppSelector(
    (state) => state.user.user.playerProfile
  );
  const dispatch = useAppDispatch();
  const [getMessagesFromRoom] = useGetMessagesFromRoomMutation();
  const [addMessage] = useAddMessageMutation();

  // fetch messages
  console.log("roomOn = ", roomOn);
  useEffect(() => {
    console.log("IN USEFFECT FETCHDATA");
    async function getMessages() {
      if (roomOn?.messages === undefined || roomOn?.messages.length === 0) {
        const response:
          | { data: Messages[] }
          | { error: FetchBaseQueryError | SerializedError } =
          await getMessagesFromRoom({ roomId: roomOn?.id || "" });
        console.log("response from getMessages = ", response);
        if ("data" in response) {
          setMessages(response.data);
        }
      } else {
        setMessages(roomOn.messages);
      }
    }
    getMessages();
  }, [dispatch, getMessagesFromRoom, roomOn]);

  // listen for messages
  useEffect(() => {
    if (mySocket) {
      mySocket.on("MESSAGE", async (data: Messages) => {
        console.log("Received message: LQLALALALALAALALA", data);
        setMessages([...messages, data]);
      });
    }
    return () => {
      mySocket.off("MESSAGE");
    };
  }, [addMessage, dispatch, getMessagesFromRoom, messages, roomOn?.messages]);

  //emit messages
  const handleEmitMessage = (content: string) => {
    try {
      console.log("in handleEmitMessage");
      let message: Messages = {
        id: "",
        content: content,
        chatId: roomOn?.id || "",
        emitterId: user.id,
        emitterName: user.name || "",
        emitterAvatar: user.imageSrc || "",
      };

      if (mySocket) {
        console.log("Message sent:", { message: message });
        mySocket.emit("MESSAGE", { message: message });
        // dispatch(newMessage(message));
      } else {
        console.error("Socket is not connected.");
      }
    } catch (error) {
      console.error("Error during message sending:", error);
    }
  };

  return (
    <div className="h-full w-[60%] p-2 flex flex-col items-center">
      <h1 className="text-4xl text-white ">{channelName}</h1>
      <MessagesDisplay roomOnId={roomOn?.id} messages={messages} />
      <input
        type="text"
        value={content}
        placeholder="chat"
        className="w-[85%] h-10 mt-7 p-2 rounded-3xl text-lg bg-white bg-opacity-80 placeholder:text-gray-700 placeholder:text-lg indent-2"
        onChange={(e) => setContent((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // sendMessage((e.target as HTMLInputElement).content);
            if (content !== "") {
              handleEmitMessage(content);
              setContent("");
            }
          }
        }}
      />
    </div>
  );
}
