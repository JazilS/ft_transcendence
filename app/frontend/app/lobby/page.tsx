'use client'

import {useState, useEffect} from 'react'
import '../styles.css'
import MyHeader from '@/components/Header'
import PlayerProfile from '@/components/PlayerProfile'
import { press_Start_2P } from '@/models/FontModel'
import { UserProfile } from '@/models/ProfilePageModel';

export default function LobbyPage() {
	return (
	<div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
		<MyHeader />
		<div className="flex flex-col items-center">
			<div className="flex justify-center space-x-20">
				<Player1 />
			<div className="flex items-center mb-80 drop-shadow-2xl">
				<span className={`text-white text-8xl drop-shadow-2 xl ${press_Start_2P.className.toString()}`}>
					VS
				</span>
			</div>
				<Player2 />	
			</div>
		</div>
	</div>
		)
}

function Player1() {
	const user =({
        name: "jsabound",
        imageSrc: "/Musashi.jpg",
        isConnected: true,
        games: [],
    });
	
	let status : string;
	
	if (user?.isConnected === true)
		status = 'READY';
	else
		status = 'Waiting a player...';
	return (
		<div className="w-[547.51px] h-[650px] pt-10 bg-gradient-to-b from-white to-indigo-300 rounded-3xl shadow-2xl items-center flex flex-col ">
			<div className='w-[250px] h-[228px]'>
				<PlayerProfile user={user} width={310} height={310}/>
			</div>
			<div className="w-[400px] h-[45px] bg-blue-600 mt-40 rounded-lg flex justify-center ">
				<p className={`w-[350px] h-full text-white text-xl mt-2 text-center text-nowrap ${press_Start_2P.className}`}>
					{status}
				</p>
			</div>
		</div>
	);
}a

function Player2() {
	const user =({
        name: "kgezgin",
        imageSrc: "/Kojiro.jpg",
        isConnected: true,
        games: [],
    });
	
	let status : string;

	if (user?.isConnected === true)
		status = 'READY';
	else
		status = 'Waiting a player...';
	return (
		<div className="w-[547.51px] h-[650px] pt-10 bg-gradient-to-t from-fuchsia-300 to-white rounded-3xl shadow-2xl items-center flex flex-col">
			<div className="w-[251px] h-[228px]">
				<PlayerProfile user={user} width={310} height={310}/>
			</div>
			<div className="w-[350px] h-[45px] bg-fuchsia-500 rounded-lg mt-40 flex justify-center">
				<p className={`text-white text-2xl mt-2 text-center ${press_Start_2P.className}`}>
					{status}
				</p>
			</div>
		</div>
	);
}