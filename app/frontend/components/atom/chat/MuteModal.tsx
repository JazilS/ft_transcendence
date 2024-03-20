"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "@/app/styles.css";
import Button from "@/components/atom/Button";
import { quantico } from "@/models/FontModel";

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

export default function MuteModal({
  open,
  handleClose,
  handleMute,
  value,
}: {
  open: boolean;
  handleClose: () => void;
  handleMute: (newValue: boolean, muteTime: number) => void;
  value: boolean;
}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={`${quantico.className} flex flex-col space-y-8`}>
            <h1 className="text-center text-3xl">Chose mute time</h1>
            <div className="flex flex-row space-x-3 text-white">
              <Button
                variant={"rounded"}
                size={"lg"}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  handleMute(value, 6000);
                  event.stopPropagation();
                  handleClose();
                }}
              >
                60 sec
              </Button>
              <Button
                variant={"rounded"}
                size={"lg"}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  handleMute(value, 60000);
                  event.stopPropagation();
                  handleClose();
                }}
              >
                10 mn
              </Button>
              <Button
                variant={"rounded"}
                size={"lg"}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  handleMute(value, 3600000);
                  event.stopPropagation();
                  handleClose();
                }}
              >
                1 hr
              </Button>
              <Button
                variant={"rounded"}
                className="bg-pink-600 hover:bg-pink-700 text-white active:bg-pink-800 active:scale-90"
                size={"lg"}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  handleClose();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
