'use client'

import PlayerProfile from '@/components/molecules/PlayerProfile'
import { press_Start_2P } from '@/models/FontModel'
import '../styles.css'
import MyHeader from '@/components/organism/Header'

export default function LobbyPage() {
	return (
	<div >
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
		<div className="w-[40%] h-[60%] p-10 mt-12 bg-white bg-opacity-5 rounded-3xl shadow-2xl items-center flex flex-col ">
			<PlayerProfile user={user} width={220} height={220} displayName={true}/>
			<div className="w-[300px] bg-blue-600 mt-10 mb-22 rounded-lg flex justify-center ">
				<p className={`w-[350px] h-full text-white text-xl mt-2 text-center text-nowrap ${press_Start_2P.className}`}>
					{status}
				</p>
			</div>
		</div>
	);
}

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
		<div className="w-[40%] h-[60%] p-10 mt-12 bg-white bg-opacity-5 rounded-3xl shadow-2xl items-center flex flex-col ">
			<PlayerProfile user={user} width={220} height={220} displayName={true}/>
			<div className="w-[300px] bg-fuchsia-600 mt-10 mb-22 rounded-lg flex justify-center ">
				<p className={`w-[350px] h-full text-white text-xl mt-2 text-center text-nowrap ${press_Start_2P.className}`}>
					{status}
				</p>
			</div>
		</div>
	);
}