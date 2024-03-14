import { useAppSelector } from "@/app/store/hooks";
import Messages from "@/models/ChatRoom/messages";
import React, { useEffect, useRef } from "react";
import AvatarNameRow from "./AvatarNameRow";
import PlayerAvatar from "../PlayerAvatar";
import "@/style/DisplayMessages.css";

export default function MessagesDisplay({
  roomOnId,
  messages,
}: {
  roomOnId: string | undefined;
  messages: Messages[] | undefined;
}) {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="h-[88%] w-full flex flex-col p-3 bg-gradient-to-b from-white/10 to-transparent rounded-lg scrollbar-hide_2">
      {messages?.map((message: Messages, index) => (
        <div
          key={index}
          className={`text-white text-lg text-left break-words flex flex-row p-0.5 space-x-1 ${
            message.emitterId === "system" ? "text-opacity-50" : null
          }`}
        >
          <PlayerAvatar src={message.emitterAvatar} width={30} height={30} />
          <span>{message.emitterName}: </span>
          <div className="word-wrap: break-word;">{message.content}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

// TODO regler le probleme d'affichage quand le message est trop long

// export default function MessagesDisplay({
//   roomOnId,
//   messages,
// }: {
//   roomOnId: string | undefined;
//   messages: Messages[] | undefined;
// }) {
//   console.log("messages in roomOn = ", messages, "rommOnId = ", roomOnId);
//   return (
//     <div className="h-[88%] w-full flex flex-col p-3 overflow-y-auto bg-gradient-to-b from-white/10 rounded-lg to-transparent">
//       {messages?.map(
//         (message: Messages, index) => (
//           console.log("emitter = ", message.emitterId),
//           (
//             <div
//               key={index}
//               className=" text-white text-lg text-left break-words flex flex-row p-0.5"
//             >
//               <AvatarNameRow userId={message.emitterId} />
//               {message.content}
//             </div>
//           )
//         )
//       )}
//     </div>
//   );
// }
