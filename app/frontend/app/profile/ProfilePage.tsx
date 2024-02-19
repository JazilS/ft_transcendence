'use client'

import React, { useState, useEffect } from 'react'
import { TextField } from "@mui/material";
import { UserProfile } from '@/models/ProfilePageModel'
import { press_Start_2P, quantico } from '@/models/FontModel'
import PlayerProfile from '@/components/molecules/PlayerProfile';
import GameHistory from '../../components/molecules/GameHistory'
import EditProfileButton from './EditAvatar';
import '../styles.css'
import EditUsername from '@/components/atom/EditUsername';

export default function ProfilePage() {
	const [user, setUser] = useState<UserProfile>({
		name: "",
		imageSrc: "",
		isConnected: true,
		games: [],
	});
	const [blur, setBlur] = useState(false)

	useEffect(() => {

		// get username and profile picture from back
		setUser({
			name: "Musashi",
			imageSrc: "/Musashi.jpg",
			isConnected: true,
			games: [
				{id: "game1", opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 10},
				{id: "game2", opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 8, scoreOpponent: 11},
				{id: "game3", opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 2},
				{id: "game4", opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 0},
				{id: "game5", opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 7, scoreOpponent: 11},
			]});
	}, []);

	let color: string
	if (user?.isConnected === true )
		color = "bg-green-500"
	else
		color = "bg-red-500"
	return (
		<div>
			<div className={`flex justify-center h-[85%] ${blur ? 'blur-xl' : 'none'}`}>
				<div className="flex flex-row w-5/6 h-full bg-white rounded-3xl p-7 space-x-7">
					<div className={`h-[738px] w-[315px] flex flex-col justify-center items-center bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500`}>
						<EditProfileButton user={user} setUser={setUser} setBlur={setBlur}/>
						<PlayerProfile user={user!} width={162} height={162} displayName={false} />
						<EditUsername user={user} setUser={setUser}/>
				<div className={`rounded-full h-3 w-3 ${color} blur-[2px]`} />
				</div>
					<div className='h-[738px] w-[855px] bg-gradient-to-br rounded-3xl from-fuchsia-500  to-indigo-500'>
						<GameHistory user={user!} />
					</div>
					<div className='h-[738px] w-[315px] bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500'/>
				</div>
			</div>
		</div>
  );
}



