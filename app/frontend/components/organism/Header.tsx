import {press_Start_2P} from '../../models/FontModel'
import Link from 'next/link'
import SettingsModal from '../molecules/settings';
import Button from '../atom/Button';
import SearchBar from '../atom/SearchBar';
import "../../app/styles.css"


export default function MyHeader({display}:{display:boolean}){
	return (
		<div  className={`${display ? 'none' : 'hidden'} bg-gradient-to-b from-black to-transparente h-[10%] flex items-center`}>
			<HeaderButtons/>
			<div className='w-[33%]' >
				<SearchBar />
			</div>
			<div className="w-[33%] flex justify-end pr-8 text-xl">
				<SettingsModal/>	
			</div>
		</div>
	);
};

function HeaderButtons() {
	return (
		<div className="w-[33%] pl-12 flex space-x-5 items-center text-xl">
			<Link href="/home">
				<Button className={`${press_Start_2P.className}`} variant={'header'}>
					Home
				</Button>
			</Link>
			<Link href="/lobby">
				<Button className={`${press_Start_2P.className}`} variant={'header'}>
					Play
				</Button>
			</Link>
			<Link href="/chat">
				<Button className={`${press_Start_2P.className}`} variant={'header'}>
					Chat
				</Button>
			</Link>
			<Link href="/profile">
				<Button className={`${press_Start_2P.className}`} variant={'header'}>
					Profile
				</Button>
			</Link>
		</div>
	);
};