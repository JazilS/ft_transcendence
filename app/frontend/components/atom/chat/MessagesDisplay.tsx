import { useAppSelector } from "@/app/store/hooks";
import Messages from "@/models/ChatRoom/messages";
import React, { use, useEffect, useRef } from "react";
import PlayerAvatar from "../PlayerAvatar";
import "@/style/DisplayMessages.css";

export default function MessagesDisplay({
  messages,
}: {
  messages: Messages[];
}) {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  // const messages: Messages[] = useAppSelector(
  //   (state) => state.chatRooms.roomOn.messages
  // );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="h-[88%] w-full flex flex-col p-3 bg-gradient-to-b from-white/10 to-transparent rounded-lg scrollbar-hide_2">
      {messages?.map((message: Messages, index) => (
        <div
          key={index}
          className={`items-start flex flex-row p-0.5 space-x-1 w-full`}
        >
          <PlayerAvatar src={message.emitterAvatar} width={30} height={30} />
          <div
            className={`text-white w-full text-lg items-start text-left flex flex-row space-x-1 ${
              message.emitterId === "system" ? "text-opacity-50" : null
            }`}
          >
            <span>{message.emitterName}: </span>
            <span className="flex-grow break-all  ">{message.content}</span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );

  // return (
  //   <div className="h-[88%] w-full flex flex-col p-3 bg-gradient-to-b from-white/10 to-transparent rounded-lg scrollbar-hide_2">
  //     {messages?.map((message: Messages, index) => (
  //       <div
  //         key={index}
  //         className={`text-white text-lg items-start text-left break-words flex flex-row p-0.5 space-x-1 ${
  //           message.emitterId === "system" ? "text-opacity-50" : null
  //         }`}
  //       >
  //         <div>
  //           <PlayerAvatar src={message.emitterAvatar} width={30} height={30} />
  //         </div>
  //         <span>{message.emitterName}: </span>
  //         <div className=" word-wrap: break-word;">{message.content}</div>
  //       </div>
  //     ))}
  //     <div ref={messagesEndRef} />
  //   </div>
  // );
}
// TODO regler le probleme d'affichage quand le message est trop long
