"use client";

import { useEffect } from "react";
import Button from "../../atom/Button";
import { useAppSelector } from "@/app/store/hooks";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import JoinChanModal from "./JoinChan";
import CreateChanModal from "./CreateChan";
import "@/style/ChannelList.css";
import { useGetChatRoomsInMutation } from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import { ConnectSocket } from "@/app/utils/getSocket";
import { useDispatch } from "react-redux";
import { getChatRoomsInLocal } from "@/app/store/features/User/UserSlice";
import { SetUserInStorage } from "@/app/utils/SetUserInStorage";

export default function ChannelBar({
  setRoomOnId,
}: {
  setRoomOnId: React.Dispatch<React.SetStateAction<string>>;
}) {
  // recuperer les channels de l'utilisateur pour le premier render

  const channels = useAppSelector((state) => state.user.user.channelsIn);
  // ConnectSocket();
  // SetUserInStorage();

  const user = useAppSelector((state) => state.user.user);

  const [getChannels] = useGetChatRoomsInMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) ConnectSocket();
    async function FetchChannels() {
      const response = await getChannels({});
      if ("data" in response) {
        dispatch(getChatRoomsInLocal(response.data));
        // console.log("channelsIn : ", response.data);
      } else {
        console.error("Error during API call for chat rooms:", response.error);
      }
    }

    FetchChannels();
  }, []);

  return (
    <div className={`h-[95%] w-full rounded-r-3xl rounded-bl-3xl bg-[#9EB7F6]`}>
      <div
        className={`h-full w-full flex flex-col space-y-2 items-start rounded-3xl bg-[#9EB7F6]`}
      >
        <div className="flex flex-row items-center w-full justify-end space-x-2 p-2">
          <CreateChanModal setRoomOnId={setRoomOnId} />
          <JoinChanModal setRoomOnId={setRoomOnId} />
        </div>
        <div className="w-full h-[91%] scrollbar-hide">
          {channels.length === 0 ? (
            <h1 className="text-center">No Channel Joined yet</h1>
          ) : (
            <ul>
              {channels!.map((channel: ChatRoom) => (
                <li key={channel.id}>
                  <Button
                    className="hover:bg-[#6E82B6] active:bg-[#596a94]"
                    variant={"publicChannel"}
                    size={"channel"}
                    onClick={() => {
                      setRoomOnId(channel.id);
                    }}
                  >
                    <h1 className="pl-8">{channel.name}</h1>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
