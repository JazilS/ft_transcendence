'use client'

import React, { useState } from "react";
import MyHeader from "@/components/Header";
import "../styles.css";
import Button from "@/components/Button";
import { Variable } from "lucide-react";
import { db } from "@/lib/db";
import ChannelBar from "@/components/ChannelList";
import Friendsbar from "@/components/FriendsBar";
import SwitchChat from "@/components/ChatSwitch";
import ChoseChat from "@/components/ChatBar";
import ChatMembers from "@/components/ChatMembers";
import { quantico } from "@/models/FontModel";


export default function HomePage() {
	const [isChan, setIsChan] = useState<boolean>(true)


	return (
		<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
			<MyHeader />
			<div className="flex justify-center h-[85%] ">
				<div className={`flex flex-row h-full w-5/6 bg-gradient-to-tr from-black to-[#314287] rounded-3xl p-2 ${quantico.className}`}>
					<ChoseChat isChan={isChan} setIsChan={setIsChan}/>
					<div className="h-full w-[60%] p-2 "></div>
					<ChatMembers members={['member 1', 'member 2']}/>
				</div>
			</div>
			{/* <Button variant='default' size='default' isLoading={false} disabled={false} >Button</ Button> */}
		</div>
	);
}
