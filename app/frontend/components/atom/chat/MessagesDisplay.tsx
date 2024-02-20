import React from "react";

export default function MessagesDisplay({ messages }: { messages: string[] }) {

	return (
	<div className="h-[88%] w-full flex flex-col overflow-y-auto">
	  {messages.map((message, index) => (
			<span
				key={index}
				className=" text-white text-lg text-left break-words"
			>
				{message}
			</span>
		))}
	</div>
  );
}
