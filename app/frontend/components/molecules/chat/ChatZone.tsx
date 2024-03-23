<<<<<<< HEAD
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
import Button from "@/components/atom/Button";
import LeaveChannel from "./LeaveChannel";

export default function ChatZone({
  roomOn,
  setRoomOnId,
}: {
  roomOn: ChatRoom | undefined;
  setRoomOnId: React.Dispatch<React.SetStateAction<string>>;
}) {
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
  useEffect(() => {
    // console.log("IN USEFFECT FETCHDATA");
    async function getMessages() {
      if (roomOn?.messages === undefined || roomOn?.messages.length === 0) {
        setMessages([]);
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
      {roomOn !== undefined ? (
        <div className="flex flex-row justify-between items-center w-full">
          <div></div> {/* Div vide pour prendre de l'espace */}
          <h1 className="text-4xl text-white">{channelName}</h1>
          <LeaveChannel
            roomOnId={roomOn.id}
            userName={user.name as string}
            userId={user.id}
            mySocket={mySocket}
            setRoomOnId={setRoomOnId}
          />
        </div>
      ) : (
        <h1 className="text-4xl text-white">{channelName}</h1>
      )}
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
=======
import MessagesDisplay from '@/components/atom/chat/MessagesDisplay';
import {useEffect, useState} from 'react';
import io, { Socket } from 'socket.io-client';


export default function ChatZone() {
	const [socket, setSocket] = useState<Socket>()
	const [messages, setMessages] = useState<string[]>([])
	const [value, setValue] = useState<string>('')
	// const channelName = useAppSelector(state => state.channel)

	// const sendMessage = (message: string) => {
	// 	socket?.emit('message', message)
	// 	console.log(`message sent : ${message}`)
	// }

	// useEffect(() => {
	// 	const newSocket = io('http://localhost:8001')
	// 	setSocket(newSocket)
	// }, [setSocket])

	
	// useEffect(() => {
	// 	const messageListener = (message: string) => {
	// 		setMessages([...messages, message])
	// 	}
	// 	socket?.on('message', messageListener)
	// 	return () => {
	// 		socket?.off('message', messageListener)
	// 	}
	// }, [messages, socket])

	return (
		<div className="h-full w-[60%] p-2 flex flex-col items-center">
			<h1 className="text-4xl text-white ">ChannelName</h1>
				<MessagesDisplay messages={messages}/>
			<input
				type="text"
				value={value}
				placeholder="chat"
				className="w-[85%] h-10 mt-7 p-2 rounded-3xl text-lg bg-white bg-opacity-80 placeholder:text-gray-700 placeholder:text-lg indent-2"
				onChange={(e) => setValue((e.target as HTMLInputElement).value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						// sendMessage((e.target as HTMLInputElement).value);
						setValue('');
					}
				}}
			/>
		</div>

  );
}
>>>>>>> mounir
