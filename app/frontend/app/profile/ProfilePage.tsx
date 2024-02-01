'use client'

import React, { useState, useEffect } from 'react'
import MyHeader from '@/components/Header'
import GameHistory from '../../components/GameHistory'
import PlayerProfile from '@/components/PlayerProfile';
import { UserProfile } from '@/models/ProfilePageModel'
import { press_Start_2P, quantico } from '@/models/FontModel'
import { TextField } from "@mui/material";
import '../styles.css'
import EditProfileButton from './EditProfile';

export default function ProfilePage() {
	const [user, setUser] = useState<UserProfile>({
		name: "",
		imageSrc: "",
		isConnected: true,
		games: [],
	});
	const [blur, setBlur] = useState(false)
	const [isEditing, setIsEditing] = useState(true)

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

	const handleUsernameChange = (value: string) => {
		setUser({ ...user, name: value });
	};

	const handleNameDisplay = (value: boolean) => {
		setIsEditing(value);
	};

	let color: string
	if (user?.isConnected === true )
		color = "bg-green-500"
	else
		color = "bg-red-500"
	return (
		<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
			<MyHeader />
			<div className={`flex justify-center ${blur ? 'blur-xl' : 'none'}`}>
				<div className="flex flex-row w-5/6 h-[789px] bg-white rounded-3xl p-7 space-x-7">
					<div className={`h-[738px] w-[315px] flex flex-col justify-center items-center bg-gradient-to-br rounded-3xl from-indigo-500  to-fuchsia-500`}>
						<EditProfileButton user={user} setUser={setUser} setBlur={setBlur}/>
						<PlayerProfile user={user!} width={162} height={162} displayName={false} />
						<div className='w-[315px] truncate mt-5'>
							{isEditing ?
								<div className={`h-[28px] w-[310] flex flex-row justify-center items-center space-y-5 truncate`}>
									<div className={`w-[310] truncate text-center text-xl ${press_Start_2P.className}`}>
										{user?.name}
									</div>
									<div className='pb-5 pl-2'>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer" onClick={() => handleNameDisplay(false)}>
											<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
										</svg>
									</div>
								</div>
								 :
							 	(<div className={`h-auto w-auto flex flex-row justify-center items-center space-y-5 `}>
							 		<TextField
										 inputProps={{
											 style: {
												 textAlign: "center",
												 ...quantico.style
											 }
										 }}
										 InputProps={{
											 style: {
												 borderRadius: "50px",
												 background: 'rgba(255, 255, 255, 0.3)',
												 border: 'none',
											 }
										 }}
										 size='small'
										 onChange={(event) => handleUsernameChange(event.target.value)}
										 value={user ? user.name : "User"}
							 		/>
									<div className='pb-5 pl-2'>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer"  onClick={() => handleNameDisplay(true)}>
											<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
										</svg>
									</div>
								</div>
							 )}
							{/* <PlayerProfile user={user!} width={162} height={162} IsEditing={IsEditing} /> */}
						</div>
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



