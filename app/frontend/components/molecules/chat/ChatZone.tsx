import { useAppSelector } from '@/app/store/store';
import MessagesDisplay from '@/components/atom/chat/MessagesDisplay';
import { send } from 'process';
import react, {useEffect, useState} from 'react';
import io, { Socket } from 'socket.io-client';


export default function ChatZone() {
	const [socket, setSocket] = useState<Socket>()
	const [messages, setMessages] = useState<string[]>([])
	const [value, setValue] = useState<string>('')
	// const channelName = useAppSelector(state => state.channel)

	const sendMessage = (message: string) => {
		socket?.emit('message', message)
		console.log(`message sent : ${message}`)
	}

	useEffect(() => {
		const newSocket = io('http://localhost:8001')
		setSocket(newSocket)
	}, [setSocket])

	
	useEffect(() => {
		const messageListener = (message: string) => {
			setMessages([...messages, message])
		}
		socket?.on('message', messageListener)
		return () => {
			socket?.off('message', messageListener)
		}
	}, [messages, socket])

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
						sendMessage((e.target as HTMLInputElement).value);
						setValue('');
					}
				}}
			/>
		</div>

  );
}