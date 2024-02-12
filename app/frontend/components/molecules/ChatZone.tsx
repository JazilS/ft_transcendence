import * as react from 'react';

export default function ChatZone() {

	return (
		<div className="h-full w-[60%] p-2 flex flex-col items-center">
			<h1 className="text-4xl text-white ">ChannelName</h1>
			<div className='h-[88%]'>
				{/* display chat*/}
			</div>
			<input type="text" placeholder='chat' className="w-[85%] h-10 p-2 rounded-3xl text-lg bg-white bg-opacity-80 placeholder:text-gray-700 placeholder:text-lg indent-2" />
		</div>

  );
}