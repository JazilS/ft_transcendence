import { Press_Start_2P } from 'next/font/google'
 
const press_Start_2P = Press_Start_2P({
	subsets: ['latin'],
	weight: '400'
  })

const myHeader: React.FC = () => {
	return (
	<div className="h-28 bg-gradient-to-b from-black to-transparent w-[100vw] flex flex-row items-center">
		<div className={`flex flex-row w-[33%] justify-evenly text-white text-2xl ${press_Start_2P.className}`}>
			<ButtonPlay></ButtonPlay>
			<ButtonProfile></ButtonProfile>
			<ButtonChat></ButtonChat>
		</div>
		<div className={`flex items-center w-[33%] justify-center ${press_Start_2P.className}`}>
			<SearchBar></SearchBar>
		</div>
		<div className={`flex items-center w-[33%] justify-end pr-7 text-white text-2xl ${press_Start_2P.className}`}>
			<ButtonSettings></ButtonSettings>
		</div>
	</div>
	);
};

const ButtonPlay: React.FC = () => {
	return (	
		<div className="inline-block">Play</div>
	);
};

const ButtonProfile: React.FC = () => {
	return (
		<div className="inline-block">Profile</div>
		
	);
};

const ButtonSettings: React.FC = () => {
	return (
		<div className="inline-block">Settings</div>
		
	);
};

const ButtonChat: React.FC = () => {
	return (
		<div className="inline-block">Chat</div>
		
	);
};

const SearchBar: React.FC = () => {
	return (
			<form className="">
				<input type='search' className=' rounded-lg h-9 w-96'></input>
			</form>
	);
};

// const myHeader: React.FC = () => {
	// return (
		// <div className="flex h-[7vh] items-center bg-black">
			{/* <div className={` text-fuchsia-200 ml-36 text-2xl ${press_Start_2P.className}`}>TRANSCENDENCE</div > */}
		{/* </div> */}
	// );
// };
// 

export default myHeader