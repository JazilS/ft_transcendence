import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { ConnectSocket, mySocket } from "@/app/utils/getSocket";
import MessagesDisplay from "@/components/atom/chat/MessagesDisplay";
import Messages from "@/models/ChatRoom/messages";
import { useEffect, useState } from "react";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import LeaveChannel from "./LeaveChannel";
import { RootState } from "@/app/store/store";
import RoomData from "@/models/ChatRoom/RoomData";
import { newMessage } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import EditRoom from "./EditRoom/EditRoom";
import { quantico } from "@/models/Font/FontModel";

export default function ChatZone() {
  const [channelName, setChannelName] = useState<string>("Not in a Chatroom");
  const [content, setContent] = useState<string>("");
  const dispatch = useAppDispatch();
  const roomOnId: string = useAppSelector(
    (state: RootState) => state.chatRooms.roomOnId
  );
  const roomOn: RoomData = useAppSelector(
    (state: RootState) => state.chatRooms.roomOn
  );
  const user: PlayerProfile = useAppSelector(
    (state: RootState) => state.user.user.playerProfile
  );

  useEffect(() => {
    console.log("roomOn changed:", roomOn);
    if (roomOn.roomInfos.roomType === "DM") {
        const friendName = roomOn.users.find((u) => u.userProfile.id !== user.id)?.userProfile
          .name || "";
        setChannelName(friendName);
    }
    else {
      setChannelName(roomOn.roomInfos.name);
    }
  }, [roomOn, user.id]);

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
      {roomOnId !== "" && roomOn.roomInfos.roomType !== "DM" ? (
        <div className="flex flex-row justify-between items-center w-full">
          <div></div> {/* Div vide pour prendre de l'espace */}
          <h1 className="text-4xl ml-14 text-white">{channelName}</h1>
          <div className="flex flex-row space-x-3">
            {roomOn.users.find((u) => u.userProfile.id === user.id)?.role !==
              "MEMBER" && <EditRoom />}
            <LeaveChannel
              roomOnId={roomOn.roomInfos.id}
              userName={user.name as string}
              userId={user.id}
              mySocket={mySocket}
            />
          </div>
        </div>
      ) : (
        <h1 className="text-4xl text-white">{channelName}</h1>
      )}
      <MessagesDisplay messages={roomOn.messages} />
      {roomOn.users.find(
        (roomUser) =>
          roomUser.userProfile.id === user.id && roomUser.fadeMenuInfos.isMuted
      ) ? (
        <span
          className={`text-red-500 ${quantico.className} text-xl text-center p-`}
        >
          You are muted !
        </span>
      ) : (
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
      )}
    </div>
  );
}
