import "../app/styles.css"
import Link from 'next/link'
import SettingsModal from './settings';
import { press_Start_2P } from '@/models/FontModel';

export default function MyHeader(){
    return (
		<div  className="bg-gradient-to-b from-black to-transparente h-[10vh] flex items-center">
			<div className="w-[34.5%] pl-12 h-28 flex gap-16 items-center text-xl">
				<HomeButton />
				<PlayButton />
				<ProfileButton />
				<ChatButton />
			</div>
			<div className='w-[33%]' >
				<SearchBar />
			</div>
			<div className="w-[33%] flex justify-end pr-8 text-xl">
				<SettingsButton />
			</div>
		</div>
	);
};

function HomeButton(){
	return (
		<Link href="/home">
			<button className={` text-white  ${press_Start_2P.className}`}>
				home
			</button>
		</Link>
	);
}

function PlayButton(){
	return (
		<Link href="/lobby">
			<button className={`text-white ${press_Start_2P.className}`}>
				play
			</button >
		</Link>
	  );
  };
  
function ChatButton(){
	return (
		<Link href="/chat">
			<button className={` text-white  ${press_Start_2P.className}`}>
				chat
			</button >
		</Link>
	  );
  };

function ProfileButton(){
    return (
		<Link href="/profile">
			<button className={` text-white  ${press_Start_2P.className}`}>
				profile
			</button>
		</Link>
    );
};


function SettingsButton() {
    return (
		<SettingsModal/>
    );
};

function SearchBar() {
	return (
		<form className="w-[350px] relative ml-32">
			<div className={`${press_Start_2P.className}`}>
				<input 
				type="search" 
				placeholder='search' 
				className='w-full h-[44px] p-4 rounded-lg  bg-white placeholder-indigo-500 text-black text-center text-xl'/>
			</div>
		</form>

	);
}

export { PlayButton, ProfileButton, ChatButton, SettingsButton, SearchBar};