'use client'

import {useState, useEffect} from "react";
import Button from "../atom/Button";
// import '../style/FriendsBar.css'

export interface Friends {
	 name: string,
	 members: string[] 
};
  
export default function Friendsbar() {
	const [friends, setFriends] = useState<Friends[]>([]);

	useEffect(() => {
		// Simulation de la récupération des données des canaux depuis le backend
		const fetchData = async () => {
			// Ici, vous pouvez appeler votre API backend pour récupérer les données des canaux
			// Par exemple :
			// const response = await fetch('votre-url-backend');
			// const data = await response.json();
			
			// Pour l'exemple, je simule des données statiques
			const data: Friends[] = [
				{ name: 'Friend 1', members: ['username', 'user 2'] },
				{ name: 'Friend 2', members: ['username', 'user 2'] },
				{ name: 'Friend 3', members: ['username', 'user 2'] }
			];
			setFriends(data);
		};

		fetchData();
	}, []);

	return (
		<div className={`h-[95%] w-full  rounded-r-3xl rounded-bl-3xl bg-[#9EB7F6]`}>
			<div className={`h-full w-full flex flex-col space-y-2 items-start rounded-3xl bg-[#6265A9]`}>
				<div className="flex flex-row items-center w-full justify-end space-x-2 p-2">
					<Button className="active:scale-95 pb-1 bg-[#767ac9] text-white text-2xl hover:bg-violet-200 hover:text-black" variant={'rounded'} size={'square'}>
						+
					</Button>
				</div>
				<div className="w-full">
					<ul>
						{friends.map(friends => (
							<li key={friends.name}>
								<Button className="hover:text-2xl text-white hover:bg-[#767ac9] active:bg-[#858ae6] " variant={'channel'} size={'channel'}>
									<h1 className="pl-8">{friends.name}</h1>
								</Button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>

	)
  }