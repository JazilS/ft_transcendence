"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "@/app/styles.css";
import Button from "@/components/atom/Button";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { press_Start_2P, quantico } from "@/models/Font/FontModel";
import {
  useGetPublicChatRoomsMutation,
  useJoinChatRoomMutation,
  useSetRoomOnMutation,
} from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { joinChannel } from "@/app/store/features/User/UserSlice";
import { connectSocket, mySocket } from "@/app/utils/getSocket";
import { addChatroom } from "@/app/store/features/ChatRoom/ChatRoomSlice";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%", // chelou un peu
  background: "linear-gradient(to top right, black, #314287)",
  borderRadius: "1.5rem",
  boxShadow: 24,
  p: 4,
};

export default function CreateChanModal({setRoomOnId}: {setRoomOnId: React.Dispatch<React.SetStateAction<string>>}) {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [Error, setError] = useState<string>("");
  const [password, setPassword] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  const [getPublicChatRooms] = useGetPublicChatRoomsMutation();
  const [JoinChatRoom] = useJoinChatRoomMutation();
  const [setRoomOn] = useSetRoomOnMutation();
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.user.user.playerProfile.id);

  const handleClose = () => {
    setOpen(false);
    setError("");
    setSelectedRoom(null);
  };
  const handleOpen = async () => {
    try {
      const response = await getPublicChatRooms();
      console.log("rooms = ", response);
      if ("data" in response) {
        setRooms(response.data);
      } else {
        console.error(
          "Error during API call for public rooms:",
          response.error
        );
      }
      setOpen(true);
    } catch (error) {
      console.error("Error during API call for public rooms:", error);
    }
  };

  const handleJoin = async (channel: ChatRoom) => {
    try {
      const response = await JoinChatRoom({
        channelId: channel.id,
        userId: userId,
        password: password,
      });
      if ("data" in response && response.data.error) {
        setError(response.data.error);
        console.log("Error: ", response.data.error);
      } else if ("data" in response) {
        console.log("Joined channel:", response.data);
        dispatch(joinChannel(response.data));
        dispatch(addChatroom(response.data));
        setRoomOnId(response.data.id);
        mySocket.emit('JOIN_ROOM', { room: response.data.id, userId: userId});
        handleClose();
      }
    } catch (error) {
      console.log("Error during API call for Join channel:", error);
    }
  };

  return (
    <div>
      <Button
        className="active:scale-95"
        variant={"rounded"}
        size={"h_7_w_16"}
        onClick={handleOpen}
      >
        Join
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col space-y-5 ">
            <h1
              className={`text-center text-white text-2xl ${press_Start_2P.className}`}
            >
              Join a channel
            </h1>
            {}

            <div className=" bg-gradient-to-b from-white/10 rounded-3xl h-96 overflow-y-scroll text-white ">
              <ul>
                {rooms?.map((channel: ChatRoom) => (
                  <li key={channel.id}>
                    <Button
                      className={`hover:text-2xl hover:bg-[#545B9F] active:bg-[#7176A8]   ${quantico.className}`}
                      variant={
                        channel.roomType === "PROTECTED"
                          ? "protectedChannel"
                          : "publicChannel"
                      }
                      size={"channel"}
                      onClick={() => {
                        setSelectedRoom(channel);
                        if (channel.roomType !== "PROTECTED") {
                          handleJoin(channel);
                        }
                      }}
                    >
                      <h1 className="pl-8">{channel.name}</h1>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            {selectedRoom?.roomType === "PROTECTED" && (
              <input
                className="w-full h-10 p-2 rounded-3xl text-lg bg-white bg-opacity-80 placeholder:text-gray-700 placeholder:text-lg indent-2"
                type="password"
                value={password}
                placeholder="Enter password"
                onChange={(e) =>
                  setPassword((e.target as HTMLInputElement).value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoin(selectedRoom);
                    setPassword("");
                  }
                }}
              />
            )}
            {Error && (
              <h1
                className={`text-red-500 text-xl text-center ${quantico.className}`}
              >
                {Error}
              </h1>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
