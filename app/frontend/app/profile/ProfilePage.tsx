'use client'

import React, { useState, useEffect } from 'react'
import MyHeader from '@/components/Header'
import GameHistory from '../../components/GameHistory'
import PlayerProfile from '@/components/PlayerProfile';
import { UserProfile } from '@/models/ProfilePageModel'
import '../styles.css'

export default function ProfilePage() {
	const [user, setUser] = useState<UserProfile>();

	useEffect(() => {

		// get username and profile picture from back
		setUser({
			name: "Musashi",
			imageSrc: "/Musashi.jpg",
			games: [
				{id: "game1", date: "01/01/0001"},
				{id: "game2", date: "02/02/0002"},
				{id: "game3", date: "03/03/0003"},
				{id: "game4", date: "04/04/0004"},
				{id: "game5", date: "05/05/0005"},
			]});
	}, []);

	return (
		<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
			<MyHeader />
			<div className='flex justify-center'>
				<div className="flex flex-row w-5/6 h-[789px] bg-white rounded-3xl p-7 space-x-7">
					<div className={`h-[738px] w-[315px] flex flex-col justify-center items-center bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500`}>
						<PlayerProfile user={user!} />
					</div>
					<div className='h-[738px] w-[855px] bg-gradient-to-br rounded-3xl from-fuchsia-500  to-indigo-500'>
							<GameHistory user={user!} />
					</div>
					<div className='h-[738px] w-[315px] bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500'>
					
					</div>
				</div>					{/* <CropDemo src= "/Pong.jpg"></CropDemo> */}
			</div>						{/* <input onChange={(event) => setUser({ name: event.target.value, imageSrc: "/Musashi.jpg" })}/> */}
		</div>
  );
}
