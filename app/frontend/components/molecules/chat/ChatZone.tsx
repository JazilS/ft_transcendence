import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { mySocket } from "@/app/utils/getSocket";
import MessagesDisplay from "@/components/atom/chat/MessagesDisplay";
import Messages from "@/models/ChatRoom/messages";
import { useEffect, useState } from "react";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import LeaveChannel from "./LeaveChannel";
import { RootState } from "@/app/store/store";
import RoomData from "@/models/ChatRoom/RoomData";
import { newMessage } from "@/app/store/features/ChatRoom/ChatRoomSlice";

export default function ChatZone() {
  const [content, setContent] = useState<string>("");
  const dispatch = useAppDispatch();
  const roomOnId: string = useAppSelector((state: RootState) => state.chatRooms.roomOnId);
  const roomOn: RoomData = useAppSelector((state: RootState) => state.chatRooms.roomOn);
  const user: PlayerProfile = useAppSelector(
    (state: RootState) => state.user.user.playerProfile
  );

  console.log("roomOn ion chatZone:", roomOn);

  // listen for messages
  useEffect(() => {
    if (mySocket) {
      mySocket.on("MESSAGE", async (data: Messages) => {
        dispatch(newMessage(data));
      });
    }
    return () => {
      mySocket.off("MESSAGE");
    };
  }, [dispatch]);

  useEffect(() => {
    console.log("roomOn changed:", roomOn);
  }, [roomOn]);

  //emit messages
  const handleEmitMessage = (content: string) => {
    try {
      let message: Messages = {
        id: "",
        content: content,
        chatId: roomOn.roomInfos.id || "",
        emitterId: user.id,
        emitterName: user.name || "",
        emitterAvatar: user.imageSrc || "",
      };
      if (mySocket) {
        console.log("Message sent:", { message: message });
        mySocket.emit("MESSAGE", { message: message });
      } else {
        console.error("Socket is not connected.");
      }
    } catch (error) {
      console.error("Error during message sending:", error);
    }
  };

  return (
    <div className="h-full w-[60%] p-2 flex flex-col items-center">
      {roomOnId !== "" ? (
        <div className="flex flex-row justify-between items-center w-full">
          <div></div> {/* Div vide pour prendre de l'espace */}
          <h1 className="text-4xl text-white">{roomOn.roomInfos.name}</h1>
          <LeaveChannel
            roomOnId={roomOn.roomInfos.id}
            userName={user.name as string}
            userId={user.id}
            mySocket={mySocket}
          />
        </div>
      ) : (
        <h1 className="text-4xl text-white">Not in a Chatroom</h1>
      )}
      <MessagesDisplay/>
      <input
        type="text"
        value={content}
        placeholder="chat"
        className="w-[85%] h-10 mt-7 p-2 rounded-3xl text-lg bg-white bg-opacity-80 placeholder:text-gray-700 placeholder:text-lg indent-2"
        onChange={(e) => setContent((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
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
