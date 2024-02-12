'use client'

import React, { useState } from "react";
import { quantico } from "@/models/FontModel";
import ChoseChat from "@/components/molecules/ChatBar";
import ChatMembers from "@/components/atom/chat/ChatMembers";
import ChatZone from "@/components/molecules/ChatZone";
import "../styles.css";

export default function HomePage() {
	const [isChan, setIsChan] = useState<boolean>(true)

	return (
		<div className="h-full">
			<div className="flex justify-center h-[85%] ">
				<div className={`flex flex-row h-full w-5/6 bg-gradient-to-tr from-black to-[#314287] rounded-3xl p-2 ${quantico.className}`}>
					<ChoseChat isChan={isChan} setIsChan={setIsChan}/>
					<ChatZone/>
					<ChatMembers members={['member 1', 'member 2']}/>
				</div>
			</div>
		</div>
	);
}
