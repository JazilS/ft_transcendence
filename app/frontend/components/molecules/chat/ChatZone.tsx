import { newMessage } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { connectSocket, mySocket } from "@/app/utils/getSocket";
import MessagesDisplay from "@/components/atom/chat/MessagesDisplay";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import Messages from "@/models/ChatRoom/messages";
import { stat } from "fs";
import { Message } from "postcss";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useMemo } from "react";
import { useGetMessagesFromRoomMutation } from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

export default function ChatZone({ roomOn }: { roomOn: ChatRoom | undefined }) {
  const [socket, setSocket] = useState<Socket>();
  const [content, setContent] = useState<string>("");
  const [messages, setMessages] = useState<Messages[]>([]);
  // const [receivedMessage, setReceivedMessage] = useState<Messages>();
  const channelName = roomOn?.name || "Not in a channel";
  const userId: string = useAppSelector(
    (state) => state.user.user.playerProfile.id
  );
  const dispatch = useAppDispatch();
  const [getMessagesFromRoom] = useGetMessagesFromRoomMutation();

  // console.log("roomOn = ", roomOn);

  useEffect(() => {
    async function fetchData() {
      const response:
        | { data: Messages[] }
        | { error: FetchBaseQueryError | SerializedError } =
        await getMessagesFromRoom({ roomId: roomOn?.id || "" });
      if ("data" in response) {
        setMessages(response.data);
      }
    }

    if (mySocket) {
      mySocket.on("MESSAGE", (data: Messages) => {
        dispatch(newMessage(data));
        fetchData();
        console.log("message received = ", data);
      });
    }
    return () => {
      mySocket.off("MESSAGE");
    };
  }, [dispatch, getMessagesFromRoom, roomOn]);

  // useEffect(() => {
  //
  // }, [receivedMessage])

  const handleEmitMessage = (content: string) => {
    try {
      console.log("TESTESTESTESTESTESTESTESTESTESTEST");
      let message: Messages = {
        id: "",
        content: content,
        chatId: roomOn?.id || "",
        emitter: userId,
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
            handleEmitMessage(content);
            setContent("");
          }
        }}
      />
    </div>
  );
}
