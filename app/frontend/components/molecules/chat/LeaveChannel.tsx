"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "@/app/styles.css";
import Button from "@/components/atom/Button";
import ChannelAccesCheckBox from "@/components/atom/chat/NewChan/ChannelAccesCheckBox";
import TextInput from "@/components/atom/chat/NewChan/TextInput";
import SubmitNewChan from "@/components/atom/chat/NewChan/SubmitNewChan";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { quantico } from "@/models/FontModel";
import { leaveChatroom } from "@/app/store/features/User/UserSlice";
import { useLeaveChatroomMutation } from "@/app/store/features/User/user.api.slice";
import { Socket } from "socket.io-client";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  borderRadius: "1.5rem",
  boxShadow: 24,
  p: 4,
};

export default function LeaveChannel({
  roomOnId,
  userName,
  userId,
  mySocket,
  setRoomOnId,
}: {
  roomOnId: string;
  userName: string;
  userId: string;
  mySocket: Socket;
  setRoomOnId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);

  const dispatch = useAppDispatch();
  const [leaveChannel] = useLeaveChatroomMutation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleLeavingChannel = () => {
    // leave from db
    leaveChannel({ userId: userId, roomId: roomOnId });
    dispatch(leaveChatroom(roomOnId));
    if (mySocket)
      mySocket.emit("LEAVE_ROOM", {
        room: roomOnId,
        userName: userName,
        userId: userId,
        leavingType: "LEAVING",
      });
    else console.log("No socket");
    setRoomOnId("");
  };

  return (
    <div>
      <Button
        className=" bg-pink-600 hover:bg-pink-700 text-white active:bg-pink-800 active:scale-90"
        variant={"rounded"}
        size={"h_7_w_16"}
        onClick={handleOpen}
      >
        Leave{" "}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            className={`flex flex-col items-center space-y-10 ${quantico.className}`}
          >
            <h1 className="text-2xl text-Black">
              Are you sure to leave channel ?
            </h1>
            <div className="flex flex-row space-x-16">
              <Button
                className="bg-pink-600 hover:bg-pink-700 text-white active:bg-pink-800 active:scale-90"
                variant={"rounded"}
                size={"h_7_w_16"}
                onClick={handleClose}
              >
                No
              </Button>
              <Button
                className="bg-[#132d53] text-white active:scale-90"
                variant={"rounded"}
                size={"h_7_w_16"}
                onClick={() => {
                  handleLeavingChannel();
                  handleClose();
                }}
              >
                Yes
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
