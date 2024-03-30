"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "@/app/styles.css";
import Button from "@/components/atom/Button";
import RoomData from "@/models/ChatRoom/RoomData";
import { useAppSelector } from "@/app/store/hooks";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";
import { MenuItem } from "@mui/material";
import { quantico } from "@/models/Font/FontModel";
import Image from "next/image";
import PlayerProfile from "../molecules/PlayerProfile";
import { useGetProfileByIdMutation } from "@/app/store/features/User/user.api.slice";
import { PlayerProfile2 } from "@/models/User/PlayerProfile/PlayerProfile";

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

export default function ViewProfile({
  targetId,
}: {
  targetId: string | undefined;
}) {
  const [getProfileById] = useGetProfileByIdMutation();
  const [open, setOpen] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<PlayerProfile2>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfileById({
        userId: targetId ? targetId : "",
      });
      if ("data" in profile) {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAA', profile.data);
		setUser(profile.data);
      }
    };
  }, []);

  return (
    <div>
      <MenuItem onClick={handleOpen} className={`${quantico.className} w-full`}>
        View Profile
      </MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col justify-center items-center">
            <PlayerProfile
              user={targetId ? user : undefined}
              width={200}
              height={200}
              displayName={true}
            />
            <Button
              onClick={handleClose}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
