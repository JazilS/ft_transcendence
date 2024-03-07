import MessagesDisplay from '@/components/atom/chat/MessagesDisplay';
import ChatRoom from '@/models/ChatRoom/ChatRoomModel';
import Messages from '@/models/ChatRoom/messages';
import {useEffect, useState} from 'react';
import io, { Socket } from 'socket.io-client';


export default function ChatZone({messages} : {messages: Messages[] | undefined}) {
	const [socket, setSocket] = useState<Socket>()
	const [value, setValue] = useState<string>('')
	// const channelName = useAppSelector(state => state.channel)

	// const sendMessage = (message: string) => {
	// 	socket?.emit('message', message)
	// 	console.log(`message sent : ${message}`)
	// }

	// useEffect(() => {
	// 	const newSocket = io('http://localhost:8001')
	// 	setSocket(newSocket)
	// }, [setSocket])

	
	// useEffect(() => {
	// 	const messageListener = (message: string) => {
	// 		setMessages([...messages, message])
	// 	}
	// 	socket?.on('message', messageListener)
	// 	return () => {
	// 		socket?.off('message', messageListener)
	// 	}
	// }, [messages, socket])

	return (
		<div className="h-full w-[60%] p-2 flex flex-col items-center">
			<h1 className="text-4xl text-white ">ChannelName</h1>
				<MessagesDisplay messages={messages}/>
			<input
				type="text"
				value={value}
				placeholder="chat"
				className="w-[85%] h-10 mt-7 p-2 rounded-3xl text-lg bg-white bg-opacity-80 placeholder:text-gray-700 placeholder:text-lg indent-2"
				onChange={(e) => setValue((e.target as HTMLInputElement).value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						// sendMessage((e.target as HTMLInputElement).value);
						setValue('');
					}
				}}
			/>
		</div>

  );
}