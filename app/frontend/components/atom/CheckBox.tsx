import { MenuItem } from "@mui/material";
import { quantico } from "@/models/Font/FontModel";
import { mySocket } from "@/app/utils/getSocket";
import { useAppSelector } from "@/app/store/hooks";
import { useEffect, useState } from "react";
import MuteModal from "./chat/MuteModal";
// import '../style/Checkbox.css'

export default function CheckBoxMenuItem({
  userId,
  targetId,
  initialState,
  roomId,
  action,
}: {
  userId: string;
  targetId: string;
  initialState: boolean;
  roomId: string;
  action: string;
}) {
  const [checked, setChecked] = useState<boolean>(initialState);
  const [muteTimeLeft, setMuteTimeLeft] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBlock = (newValue: boolean) => {
    setChecked(newValue);
    console.log("check value = ", checked);
    if (userId !== "") {
      mySocket.emit("BLOCK_USER", {
        blockerId: userId,
        blockedUserId: targetId,
        value: checked,
      });
    }
  };

  const handleMute = (newValue: boolean, muteTime: number) => {
    handleClose();
    setChecked(newValue);
    console.log("muteTime = ", muteTime);
    if (userId !== "") {
      mySocket.emit("MUTE_USER", {
        roomId: roomId,
        mutedUser: targetId,
        muteTime: muteTime,
      });
    }
  };

  const handleUnMute = (newValue: boolean) => {
    setChecked(newValue);
    if (userId !== "") {
      mySocket.emit("UNMUTE_USER", {
        roomId: roomId,
        mutedUser: targetId,
      });
    }
  };

  useEffect(() => {
    const handleMuteUser = (timeLeft: number) => {
      setMuteTimeLeft(timeLeft);
    };

    mySocket.on("MUTE_USER", handleMuteUser);

    return () => {
      mySocket.off("MUTE_USER", handleMuteUser);
    };
  }, []);

  return (
    <MenuItem
      onClick={() => {
        if (action === "block") {
          handleBlock(!checked);
        } else if (action === "mute") {
          if (!checked) handleOpen();
          else handleUnMute(!checked);
        }
      }}
      className={`${quantico.className} w-full`}
    >
      <div className="flex flex-row justify-between w-full">
        {action === "block" &&
          (checked ? <span>Unblock</span> : <span>Block</span>)}
        {action === "mute" &&
          (checked ? (
            <span>Unmute : {muteTimeLeft}s left </span>
          ) : (
            <span>Mute</span>
          ))}
      </div>
      <MuteModal
        open={open}
        handleClose={handleClose}
        handleMute={handleMute}
        value={!checked}
      ></MuteModal>
    </MenuItem>
  );
}
