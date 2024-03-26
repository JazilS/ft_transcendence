import { quantico } from "@/models/Font/FontModel";
import Button from "../../Button";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { addRoom, setRoomOnId } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import { joinChannel } from "@/app/store/features/User/UserSlice";
import {
  useCreateChatRoomMutation,
  useSetRoomOnMutation,
} from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import createChatRoomForm from "@/models/ChatRoom/CreateChatRoomForm";
import { useState } from "react";
import { RootState } from "@/app/store/store";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import { mySocket } from "@/app/utils/getSocket";
// import { SetUserInStorage } from "@/app/utils/SetUserInStorage";

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
    const channelObject: createChatRoomForm = {
      name: channelName,
      type: access,
      password: password,
      creatorId: "",
    };

    try {
      const response = await createChatRoom(channelObject);
      console.log("created chatroom = ", response);
      if ("data" in response) {
        if ("error" in response.data) {
          console.log("error = ", response.data.error);
          setError(response.data.error as string);
        } else {
          const responseData: ChatRoom = response.data;
          console.log("room created : ", responseData);
          dispatch(addRoom(responseData));
          dispatch(joinChannel(responseData));
          dispatch(setRoomOnId(responseData.id));
          console.log("user id FOR JOIN ROOM: ", user.playerProfile.id);
          mySocket.emit("JOIN_ROOM", {
            room: responseData.id,
            userId: user.playerProfile.id,
          });
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
          onClick={handleClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
