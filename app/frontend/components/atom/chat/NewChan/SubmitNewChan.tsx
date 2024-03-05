import { quantico } from "@/models/Font/FontModel";
import Button from "../../Button";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { addRoom } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import { joinChannel } from "@/app/store/features/User/UserSlice";
import { useCreateChatRoomMutation } from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import createChatRoomForm from "@/models/ChatRoom/CreateChatRoomForm";
import { useState } from "react";
import { RootState } from "@/app/store/store";

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
  const user = useAppSelector((state: RootState) => state.user.user);
  const [error, setError] = useState<string>("false");

  const handleSubmitNewChan = async () => {
    console.log(password);
    const channelObject: createChatRoomForm = {
      name: channelName,
      type: access,
      password: password,
      creator: user.playerProfile.id,
    };
    // dispatch(joinChannel(channelObject));

    // TODO -> gerer correctement les cas d'erreur
    try {
      const response = await createChatRoom(channelObject);
      console.log("response = ", response);
      if ("data" in response) {
        if ("error" in response.data) {
          setError(response.data.error as string);
        } else {
          console.log(">REUSSSSSIIITTTEE");
          dispatch(addRoom(response.data));
          dispatch(joinChannel(response.data));
          handleClose();
        }
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-5 h-[100%] w-[100%]">
      {error !== "false" && (
        <h1 className="text-red-500 text-xl text-center">{error}</h1>
      )}
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
    </div>
  );
}
