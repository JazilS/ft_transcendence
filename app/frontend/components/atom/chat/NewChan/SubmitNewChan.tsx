import { quantico } from "@/models/Font/FontModel";
import Button from "../../Button";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { addRoom } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import { joinChannel } from "@/app/store/features/User/UserSlice";

export default function SubmitNewChan({
  access,
  channelName,
  handleClose,
}: {
  access: string;
  channelName: string;
  handleClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const handleSubmitNewChan = () => {
    const channelObject: ChatRoom = {
      id: uuidv4(),
      name: channelName,
      roomType: access,
      users: [user.playerProfile.id],
      messages: [],
    };
    dispatch(addRoom(channelObject));
    dispatch(joinChannel(channelObject));
    handleClose();
  };

  return (
    <div className="w-full flex flex-row justify-center space-x-32 mt-10">
      <Button
        variant={"rounded"}
        className={`w-[20%] text-white ${quantico.className}`}
        onClick={() => handleSubmitNewChan()}
      >
        Create
      </Button>
      <Button
        variant={"rounded"}
        className={`w-[20%] text-white ${quantico.className} hover:bg-pink-500`}
      >
        Cancel
      </Button>
    </div>
  );
}
