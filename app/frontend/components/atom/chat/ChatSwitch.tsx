import { useGetChatRoomsInMutation } from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import Button from "../Button";
import { quantico } from "@/models/Font/FontModel";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { getChatRoomsInLocal } from "@/app/store/features/User/UserSlice";

export default function SwitchChat({
  setIsChan,
}: {
  setIsChan: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const userId: string = useAppSelector(
    (state) => state.user.user.playerProfile.id
  );
  const [getChatRoomsInFromAPI] = useGetChatRoomsInMutation();
  const dispatch = useAppDispatch();
  
  const handleSetIsChan = async (value: boolean) => {
    if (value) {
    const response = await getChatRoomsInFromAPI({userId: userId});
    if ("data" in response) {
      dispatch(getChatRoomsInLocal(response.data));
      console.log("ChatRoomsIn = ", response);
      setIsChan(value);
    }
    else {
      console.error("Error during API call for chat rooms:", response.error);
    }
  }
    else
      setIsChan(value);
  };

  return (
    <div className={`flex flex-row h-[35px] ${quantico.className}`}>
      <Button
        onClick={() => handleSetIsChan(true)}
        className="bg-[#9EB7F6] hover:text-xl"
        variant={"chatSwitch"}
        size={"h36px_w95px"}
      >
        Channels
      </Button>
      <Button
        onClick={() => handleSetIsChan(false)}
        className="bg-[#6265A9] hover:text-xl text-white"
        variant={"chatSwitch"}
        size={"h36px_w95px"}
      >
        Friends
      </Button>
    </div>
  );
}
