"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "@/app/styles.css";
import Button from "@/components/atom/Button";
import ChannelAccesCheckBox from "@/components/atom/chat/NewChan/ChannelAccesCheckBox";
import NewChanName from "@/components/atom/chat/NewChan/NewchannelName";
import SubmitNewChan from "@/components/atom/chat/NewChan/SubmitNewChan";

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

  return (
    <div>
      <Button
        className="active:scale-95"
        variant={"rounded"}
        size={"h_7_w_16"}
        onClick={handleOpen}
      >
        New
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col">
            <NewChanName
              channelName={channelName}
              setChannelName={setChannelName}
            />
            <ChannelAccesCheckBox access={access} setAccess={setAccess} />
            <SubmitNewChan
              channelName={channelName}
              access={access}
              handleClose={handleClose}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
