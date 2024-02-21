'use client'

import {useState, useEffect} from "react";
import Button from "../../atom/Button";
import { ChatRoom, User, useAppDispatch, useAppSelector } from "@/app/store/store";
import NewChanModal from "./NewChan";
// import '../style/ChannelList.css'

export interface Channel {
	 name: string,
	 members: string[] 
};

export default function ChannelBar() {
	const dispatch = useAppDispatch();
	const user : User | undefined = useAppSelector(state => state.users.find(user => user.id === state.currentUserId));
	const channels: ChatRoom[] = useAppSelector(state => state.rooms.filter(room => room.roomType === 'public'));

	// const channels: ChatRoom[] = useAppSelector((state) => state.rooms.filter(room => room.roomType === 'public' || (room.roomType && room.users.find(user => user === state.currentUserId))));

	useEffect(() => {
	  console.log('channels changed:', channels);
	}, [channels]);
  
// state.rooms.filter(room => room.roomType === 'public' || room.users.find(user => user.id === state.currentUserId))
	return (
		<div className={`h-[95%] w-full rounded-r-3xl rounded-bl-3xl bg-[#9EB7F6]`}>
			<div className={`h-full w-full flex flex-col space-y-2 items-start rounded-3xl bg-[#9EB7F6]`}>
				<div className="flex flex-row items-center w-full justify-end space-x-2 p-2">
					<NewChanModal/>
					<Button className="active:scale-95" variant={'rounded'} size={'h_7_w_16'}>
						Join
					</Button>
				</div>
				<div className="w-full">
					<ul>
						{channels.map(channel => (
							<li key={channel.id}>
								<Button className="hover:text-2xl hover:bg-[#6E82B6] active:bg-[#596a94]" variant={'channel'} size={'channel'}>
									<h1 className="pl-8">{channel.name}</h1>
								</Button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>

	)
  }