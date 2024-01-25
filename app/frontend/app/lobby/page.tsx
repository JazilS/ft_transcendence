import React from 'react'
import '../styles.css'
import MyHeader from '@/components/Header'
import PlayerProfile from '@/components/PlayerProfile'
import { press_Start_2P } from '@/models/FontModel'

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
	return (
		<div className="w-[547.51px] h-[650px] pt-10 bg-gradient-to-b from-white to-indigo-300 rounded-3xl shadow-2xl items-center flex flex-col ">
			<div className='w-[250px] h-[128px]'>
				<PlayerProfile user={{name: 'jsabound', imageSrc: '/Musashi.jpg', games: [], isConnected: true}} width={128} height={128}/>
			</div>
			<div className="w-[350px] h-[45px] bg-blue-600 mt-40 rounded-lg flex justify-center">
				<div className={`text-white text-2xl mt-2 text-center ${press_Start_2P.className}`}>
					READY
				</div>
			</div>
		</div>
	);
}

function Player2() {
	return (
		<div className="w-[547.51px] h-[650px] pt-10 bg-gradient-to-t from-fuchsia-300 to-white rounded-3xl shadow-2xl items-center flex flex-col">
			<div className="w-[251px] h-[255px] bg-fuchsia-500 flex justify-around flex-col items-center p-5 rounded-3xl">
			 	<div className="w-32 h-32 bg-white rounded-full " />
					<div className={`text-center text-black text-2xl ${press_Start_2P.className}`}>
						Username
					</div>	
			</div>
			<div className="w-[350px] h-[45px] bg-fuchsia-500 rounded-lg mt-40 flex justify-center">
				<div className={`text-white text-2xl mt-2 text-center ${press_Start_2P.className}`}>
					READY
				</div>
			</div>
		</div>
	);
}