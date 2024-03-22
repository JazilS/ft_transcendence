import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import { quantico } from "@/models/Font/FontModel";
import { mySocket } from "@/app/utils/getSocket";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import MuteModal from "./chat/MuteModal";
import FadeMenuInfos from "@/models/ChatRoom/FadeMenuInfos";
import { setUserProfiles } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";
// import '../style/Checkbox.css'

export default function CheckBoxMenuItem({
  userId,
  targetProfile,
  roomId,
  action,
}: {
  userId: string;
  targetProfile: ChatMemberProfile;
  roomId: string;
  action: string;
}) {
  const [checked, setChecked] = useState<boolean>(targetProfile.fadeMenuInfos.isBlocked);
  const [muted, setMuted] = useState<boolean>(targetProfile.fadeMenuInfos.isMuted);
  const [muteTimeLeft, setMuteTimeLeft] = useState<number>();
  const [open, setOpen] = useState(false);
  const userProfiles = useAppSelector((state) => state.chatRooms.userProfiles);
  const dispatch = useAppDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBlock = (newValue: boolean) => {
    setChecked(newValue);
    console.log("check value = ", checked);
    if (userId !== "") {
      mySocket.emit("BLOCK_USER", {
        blockerId: userId,
        blockedUserId: targetProfile.userProfile.id,
        value: checked,
      });
    }
  };

  const handleMute = (muteTime: number) => {
    handleClose();
    setMuted(true);
    console.log("muteTime = ", muteTime);
    if (userId !== "") {
      mySocket.emit("MUTE_USER", {
        roomId: roomId,
        mutedUser: targetProfile.userProfile.id,
        muteTime: muteTime,
      });
      const updatedProfiles = userProfiles.map((user) =>
        user.userProfile.id === targetProfile.userProfile.id
          ? { ...user, fadeMenuInfos: { ...user.fadeMenuInfos, isMuted: true } }
          : user
      );
      dispatch(setUserProfiles(updatedProfiles));
    }
  };

  const handleUnMute = (newValue: boolean) => {
    // setChecked(newValue);
    // if (userId !== "") {
    setMuted(newValue);
    setMuteTimeLeft(0);
    mySocket.emit("UNMUTE_USER", {
      roomId: roomId,
      mutedUser: targetId,
    });
    // }
  };

  useEffect(() => {
    mySocket.on("MUTE_USER", (userId: string, timeLeft: number) => {
      if (timeLeft <= 0) {
        console.log("timeLeft RECEIVED MUTE_USER = ", timeLeft);
        setMuted(false);
        setMuteTimeLeft(0);
        const updatedProfiles = userProfiles.map((user) =>
          user.userProfile.id === targetId
            ? {
                ...user,
                fadeMenuInfos: { ...user.fadeMenuInfos, isMuted: false },
              }
            : user
        );
        dispatch(setUserProfiles(updatedProfiles));
      } else {
        setMuted(true);
        setMuteTimeLeft(timeLeft);
        console.log("muteTime = ", timeLeft);
      }
    });

    // mySocket.on("GET_MUTE_TIME", (data: number) => {
    //   setMuteTimeLeft(data);
    // });

    return () => {
      mySocket.off("MUTE_USER");
      // mySocket.off("GET_MUTE_TIME");
    };
  }, [dispatch, roomId, userProfiles]);

  return (
    <MenuItem
      onClick={() => {
        if (action === "block") {
          handleBlock(!checked);
        } else if (action === "mute") {
          if (!muted) handleOpen();
          else handleUnMute(!muted);
        }
      }}
      className={`${quantico.className} w-full`}
    >
      <div className="flex flex-row justify-between w-full">
        {action === "block" &&
          (checked ? <span>Unblock</span> : <span>Block</span>)}
        {action === "mute" &&
          (muted ? (
            <span>Unmute : {muteTimeLeft}s left </span>
          ) : (
            <span>Mute</span>
          ))}
      </div>
      <MuteModal
        open={open}
        handleClose={handleClose}
        handleMute={handleMute}
        value={!muted}
      ></MuteModal>
    </MenuItem>
  );
}
