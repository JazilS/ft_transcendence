"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "@/app/styles.css";
import Button from "@/components/atom/Button";
import ChannelAccesCheckBox from "@/components/atom/chat/NewChan/ChannelAccesCheckBox";
import TextInput from "@/components/atom/chat/NewChan/TextInput";
import SubmitNewChan from "@/components/atom/chat/NewChan/SubmitNewChan";
import RoomData from "@/models/ChatRoom/RoomData";
import { useAppSelector } from "@/app/store/hooks";
import { mySocket } from "@/app/utils/getSocket";
import { useEffect } from "react";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%", // chelou un peu
  bgcolor: "background.paper",
  borderRadius: "1.5rem",
  boxShadow: 24,
  p: 4,
};

export default function EditRoom() {
  const [open, setOpen] = React.useState(false);

  const roomOn: RoomData = useAppSelector((state) => state.chatRooms.roomOn);

  const [channelName, setChannelName] = React.useState(roomOn.roomInfos.name);
  const [access, setAccess] = React.useState(roomOn.roomInfos.roomType);
  const [password, setPassword] = React.useState<string | undefined>(undefined);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // setChannelName(channelName);
    // setAccess(access);
    // setPassword(password);
    const newRoom: RoomData = {
      roomInfos: {
        id: roomOn.roomInfos.id,
        name: channelName,
        roomType: access,
      },
      users: roomOn.users,
      messages: roomOn.messages,
      password: password,
    };
    console.log(
      "AAAAAAAAAAAAAAAAAAAAAACCCCCCCCCCCCCCCCCCCEEEESSSSSSSSSSSSSS = ",
      access
    );
    if (access == "PROTECTED" && (password == undefined || password === "")) {
      console.log("BBBBB return error catched ");
      return;
    } else {
      console.log("socket emit ---");
      if (mySocket) {
        mySocket.emit("UPDATE_ROOM", { room: roomOn, newRoom: newRoom });
      } else {
        console.error("Socket is not connected.");
      }
    }
  };
  useEffect(() => {
    setChannelName(roomOn.roomInfos.name);
    setAccess(roomOn.roomInfos.roomType);
    setPassword(roomOn.password);
  }, [roomOn]);

  return (
    <div>
      <Button
        className="active:scale-95"
        variant={"rounded"}
        size={"h_7_w_16"}
        onClick={handleOpen}
      >
        Edit
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col justify-center items-center">
            <TextInput setText={setChannelName} nameOrPass={"Channel name"} />
            <ChannelAccesCheckBox access={access} setAccess={setAccess} />
            {access === "PROTECTED" && (
              <div className="mt-10">
                <TextInput setText={setPassword} nameOrPass={"Password"} />
              </div>
            )}
            <Button
              variant={"rounded"}
              size={"h_7_w_16"}
              onClick={handleClose}
              className="mt-10"
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
