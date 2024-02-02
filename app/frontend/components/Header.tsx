import { Press_Start_2P } from 'next/font/google'
import "../app/styles.css"
import Link from 'next/link'
import SettingsModal from './settings';

export default function MyHeader(){
    return (
		<div  className="bg-gradient-to-b from-black to-transparente h-[10vh] flex items-center">
			<div className="w-[33%] pl-12 flex gap-16 items-center text-xl">
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

const HomeButton: React.FC = () => {
	return (
		<Link href="/home">
			<button className={` text-white  ${press_Start_2P.className}`}>
				home
			</button>
		</Link>
	);
}

const PlayButton: React.FC = () => {
	return (
		<Link href="/lobby">
			<button className={`text-white ${press_Start_2P.className}`}>
				play
			  </button >
		</Link>
	  );
  };
  
const ChatButton: React.FC = () => {
	return (
		<Link href="/chat">
			<button className={` text-white  ${press_Start_2P.className}`}>
				chat
			</button >
		</Link>
	  );
  };

const ProfileButton: React.FC = () => {
    return (
		<Link href="/profile">
			<button className={` text-white  ${press_Start_2P.className}`}>
				profile
			</button>
		</Link>
    );
};


const SettingsButton: React.FC = () => {
    return (
		<SettingsModal/>
    );
};

const SearchBar: React.FC = () => {
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

const press_Start_2P = Press_Start_2P({
    subsets: ['latin'],
    weight: '400'
  })

export { PlayButton, ProfileButton, ChatButton, SettingsButton, SearchBar, press_Start_2P};