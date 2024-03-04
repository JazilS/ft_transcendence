import { quantico } from "@/models/Font/FontModel";
import Button from "../../Button";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { addRoom } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import { joinChannel } from "@/app/store/features/User/UserSlice";
import { useCreateChatRoomMutation } from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import createChatRoomForm from "@/models/ChatRoom/CreateChatRoomForm";

export default function SubmitNewChan({
  access,
  password,
  channelName,
  handleClose,
}: {
  access: string;
  password: string;
  channelName: string;
  handleClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [createChatRoom] = useCreateChatRoomMutation();
  const user = useAppSelector((state) => state.user.user);

  const handleSubmitNewChan = async () => {
    console.log(password);
    const channelObject: createChatRoomForm = {
      name: channelName,
      type: access,
      password: password,
      creator: user.playerProfile.id,
    };
    // dispatch(joinChannel(channelObject));
    try {
      const response = await createChatRoom(channelObject);
      console.log(response);
      if ('data' in response) {
        console.log('>REUSSSSSIIITTTEE');
        // dispatch(addRoom(response.data));
        }
    } catch (error) {
      console.error('Error during API call:', error);
    }
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
