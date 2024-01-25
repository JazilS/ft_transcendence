// 'use client'

import { Press_Start_2P } from 'next/font/google'
import "../app/styles.css"
import Link from 'next/link'

export default function MyHeader(){
    return (
		<div  className="bg-gradient-to-b from-black to-transparente h-[10vh] flex items-center">
			<div className="w-[33%] pl-12 h-[10vh] flex gap-16 items-center">
				<PlayButton />
				<ProfileButton />
				<ChatButton />
			</div>
			<div className='w-[33%]' >
				<SearchBar />
			</div>
			<div className="w-[33%] flex justify-end pr-12">
				<SettingsButton />
			</div>
		</div>
	);
};

const PlayButton: React.FC = () => {
	return (
			<Link href="/lobby">
			<button className={`text-white text-2xl ${press_Start_2P.className}`}>
				play
			  </button >
			</Link>
	  );
  };
  
const ChatButton: React.FC = () => {
	return (
		<Link href="/Chat">
			<button className={` text-white  text-2xl ${press_Start_2P.className}`}>
				chat
			</button >
		</Link>
		);
	};

const ProfileButton: React.FC = () => {
    return (
		<Link href="/profile">
			<button className={` text-white  text-2xl ${press_Start_2P.className}`}>
				profile
			</button>
		</Link>
	);
};


const SettingsButton: React.FC = () => {
    return (
            <button className={` text-white text-2xl ${press_Start_2P.className}`}>
              settings
            </button >
    );
};

const SearchBar: React.FC = () => {
	return (
		<form className="w-[400px] ml-32">
			<div className={`${press_Start_2P.className}`}>
				<input 
				type="search" 
				placeholder='search' 
				className='w-full h-[44px] p-4 rounded-lg  bg-white placeholder-indigo-500 text-black text-center text-xl'/>
			</div>
		</form>

	);
}

const press_Start_2P = Press_Start_2P({
    subsets: ['latin'],
    weight: '400'
  })

export { PlayButton, ProfileButton, ChatButton, SettingsButton, SearchBar, press_Start_2P};