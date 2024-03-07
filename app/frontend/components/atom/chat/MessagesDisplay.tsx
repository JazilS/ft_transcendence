import Messages from "@/models/ChatRoom/messages";
import React from "react";

export default function MessagesDisplay({ messages }: { messages: Messages[] | undefined }) {

	return (
	<div className="h-[88%] w-full flex flex-col p-3 overflow-y-auto bg-gradient-to-b from-white/10 rounded-lg to-transparent">
	  {messages?.map((message, index) => (
			<span
				key={index}
				className=" text-white text-lg text-left break-words">
					{message.content}
			</span>
		))}
	</div>
  );
}
