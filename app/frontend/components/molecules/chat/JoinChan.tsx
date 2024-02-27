"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "@/app/styles.css";
import Button from "@/components/atom/Button";
import ChannelAccesCheckBox from "@/components/atom/chat/NewChan/ChannelAccesCheckBox";
import NewChanName from "@/components/atom/chat/NewChan/NewchannelName";
import SubmitNewChan from "@/components/atom/chat/NewChan/SubmitNewChan";
import { useAppSelector } from "@/app/store/hooks";
import { Height } from "@mui/icons-material";
import { Weight } from "lucide-react";
import { press_Start_2P, quantico } from "@/models/Font/FontModel";

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

export default function CreateChanModal() {
  const [open, setOpen] = React.useState(false);
  const [channelName, setChannelName] = React.useState<string>("Channel");
  const [access, setAccess] = React.useState<string>("public");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const channels = useAppSelector((state) =>
    state.chatRooms.chatRooms.filter((room) => room.roomType === "public")
  );

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
          <div className="flex flex-col space-y-5">
            <h1 className={`text-center text-2xl ${press_Start_2P.className}`}>
              Join a channel
            </h1>
            <div className="bg-gray-300 rounded-3xl h-96">
              <ul>
                {channels!.map((channel) => (
                  <li key={channel.id}>
                    <Button
                      className={`hover:text-2xl hover:bg-gray-400 active:bg-gray-500 ${quantico.className}`}
                      variant={"channel"}
                      size={"channel"}
                    >
                      <h1 className="pl-8">{channel.name}</h1>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
