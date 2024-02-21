import { quantico } from "@/models/FontModel";
import Button from "../../Button";
import { ChatRoom, useAppDispatch, useAppSelector } from "@/app/store/store";
import { v4 as uuidv4 } from "uuid";
import { channel } from "diagnostics_channel";
import { useEffect } from "react";

export default function SubmitNewChan({
  access,
  channelName,
  handleClose,
}: {
  access: string;
  channelName: string;
  handleClose: () => void;
}) {

  let newRoomId: string = uuidv4();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.find((user) => user.id === state.currentUserId));

  const handleSubmitNewChan = () => {
    const channelObject: ChatRoom = {
      id: newRoomId,
      name: channelName,
      roomType: access,
      users: [user!.id],
      messages: [],
    };

    dispatch({ type: "ADD_ROOM", payload: channelObject });
    dispatch({ type: "ADD_ROOM_TO_USER", payload: channelObject });
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
