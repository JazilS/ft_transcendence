'use client'

import {useState, useEffect} from "react";
import Button from "./Button";
import { quantico } from "@/models/FontModel";
// import '../style/ChannelList.css'

export interface Channel {
	 name: string,
	 members: string[] 
};
  
export default function ChannelBar() {
	const [channel, setChannels] = useState<Channel[]>([]);

	useEffect(() => {
		// Simulation de la récupération des données des canaux depuis le backend
		const fetchData = async () => {
			// Ici, vous pouvez appeler votre API backend pour récupérer les données des canaux
			// Par exemple :
			// const response = await fetch('votre-url-backend');
			// const data = await response.json();
			
			// Pour l'exemple, je simule des données statiques
			const data: Channel[] = [
				{ name: 'Channel 1', members: ['user 1', 'user 2', 'user 3'] },
				{ name: 'Channel 2', members: ['user 4', 'user 5', 'user 6'] },
				{ name: 'Channel 3', members: ['user 7', 'user 8', 'user 9'] }
			];
			setChannels(data);
		};

		fetchData();
	}, []);

	return (
		<div className={`h-[95%] w-full rounded-r-3xl rounded-bl-3xl bg-[#9EB7F6]`}>
			<div className={`h-full w-full flex flex-col space-y-2 items-start rounded-3xl bg-[#9EB7F6]`}>
				<div className="flex flex-row items-center w-full justify-end space-x-2 p-2">
					<Button className="active:scale-95" variant={'rounded'} size={'h_7_w_16'}>
						New
					</Button>
					<Button className="active:scale-95" variant={'rounded'} size={'h_7_w_16'}>
						Join
					</Button>
				</div>
				<div className="w-full">
					<ul>
						{channel.map(channel => (
							<li key={channel.name}>
								<Button className="hover:text-2xl hover:bg-[#6E82B6] active:bg-[#596a94]" variant={'channel'} size={'channel'}>
									<h1 className="pl-8">{channel.name}</h1>
								</Button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>

	)
  }