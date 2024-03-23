import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import SwitchChat from "../../atom/chat/ChatSwitch";
import ChannelBar from "./ChannelList";
import Friendsbar from "./FriendsBar";

export default function ChoseChat ({
		setIsChan,
		setRoomOnId,
		isChan,
	} : {
		setIsChan: React.Dispatch<React.SetStateAction<boolean>>;
		setRoomOnId: React.Dispatch<React.SetStateAction<string>>;
		isChan: boolean
	}) {

	return (
		<div className="flex flex-col w-[20%]">
			<SwitchChat setIsChan={setIsChan}/>
			{isChan ? (
				<ChannelBar setRoomOnId={setRoomOnId}/>
				) : (
				<Friendsbar/>
			)}
		</div>
	)
}