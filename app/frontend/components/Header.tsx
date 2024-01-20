import { Press_Start_2P } from 'next/font/google'
import "../app/styles.css"

export default function MyHeader(){
    return (
		<div  className="bg-gradient-to-b from-black to-transparente h-[10vh] flex items-center">
			<div className="w-[33%] pl-12 h-28 flex gap-16 items-center">
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
			  <button className={`text-white text-2xl ${press_Start_2P.className}`}>
				play
			  </button >
	  );
  };
  
const ChatButton: React.FC = () => {
	return (
			  <button className={` text-white  text-2xl ${press_Start_2P.className}`}>
				chat
			  </button >
	  );
  };

const ProfileButton: React.FC = () => {
    return (
			<button className={` text-white  text-2xl ${press_Start_2P.className}`}>
				profile
			</button>
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
		<form className="w-[440px] relative ml-32">
			<div className={`${press_Start_2P.className}`}>
				<input type="search" placeholder='Type here' className='w-full p-4 rounded-lg  bg-white placeholder-indigo-500 text-black'/>
			</div>
		</form>

	);
}

const press_Start_2P = Press_Start_2P({
    subsets: ['latin'],
    weight: '400'
  })

