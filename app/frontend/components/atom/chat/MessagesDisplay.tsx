import { useAppSelector } from "@/app/store/hooks";
import Messages from "@/models/ChatRoom/messages";
import React, { useEffect } from "react";

export default function MessagesDisplay({
  roomOnId,
  messages,
}: {
  roomOnId: string | undefined;
  messages: Messages[] | undefined;
}) {
  //   const messages: Messages[] | undefined = useAppSelector(
  //     (state) =>
  //       state.chatRooms.chatRooms.find((room) => room.id === roomOnId)?.messages
  //   );
  //   const state = useAppSelector((state) => state);
  //   console.log(state);

  console.log("messages in roomOn = ", messages, "rommOnId = ", roomOnId);
  return (
    <div className="h-[88%] w-full flex flex-col p-3 overflow-y-auto bg-gradient-to-b from-white/10 rounded-lg to-transparent">
      {messages?.map((message, index) => (
        <span key={index} className=" text-white text-lg text-left break-words">
          {message.content}
        </span>
      ))}
    </div>
  );
}
