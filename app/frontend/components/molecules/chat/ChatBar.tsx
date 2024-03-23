<<<<<<< HEAD
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
=======
>>>>>>> mounir
import SwitchChat from "../../atom/chat/ChatSwitch";
import ChannelBar from "./ChannelList";
import Friendsbar from "./FriendsBar";

export default function ChoseChat ({
		setIsChan,
<<<<<<< HEAD
		setRoomOnId,
		isChan,
	} : {
		setIsChan: React.Dispatch<React.SetStateAction<boolean>>;
		setRoomOnId: React.Dispatch<React.SetStateAction<string>>;
=======
		isChan
	} : {
		setIsChan: React.Dispatch<React.SetStateAction<boolean>>;
>>>>>>> mounir
		isChan: boolean
	}) {

	return (
		<div className="flex flex-col w-[20%]">
			<SwitchChat setIsChan={setIsChan}/>
			{isChan ? (
<<<<<<< HEAD
				<ChannelBar setRoomOnId={setRoomOnId}/>
=======
				<ChannelBar/>
>>>>>>> mounir
				) : (
				<Friendsbar/>
			)}
		</div>
	)
}