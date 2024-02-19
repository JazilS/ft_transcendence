import { press_Start_2P } from "@/models/FontModel";

export default function SearchBar() {
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