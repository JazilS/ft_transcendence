import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import { quantico } from "@/models/Font/FontModel";
import { mySocket } from "@/app/utils/getSocket";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import FadeMenuInfos from "@/models/ChatRoom/FadeMenuInfos";
import { setUserProfiles } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";
import MuteModal from "../MuteModal";
// import '../style/Checkbox.css'

export default function Mute({
  userId,
  targetProfile,
  roomId,
}: {
  userId: string;
  targetProfile: ChatMemberProfile;
  roomId: string;
}) {
  const [muteTimeLeft, setMuteTimeLeft] = useState<number>();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const userProfiles: ChatMemberProfile[] = useAppSelector(
    (state) => state.chatRooms.userProfiles
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMute = (muteTime: number) => {
    handleClose();
    // console.log("muteTime = ", muteTime);
    console.log("targetProfile IN MUTE = ", targetProfile);
    // console.log("userProfiles = ", userProfiles);
    if (userId !== "") {
      const avion: any = {
        roomId: roomId,
        mutedUser: targetProfile.userProfile.id,
        muteTime: muteTime,
      };
      console.log("avion = ", avion);
      mySocket.emit("MUTE_USER", avion);

      // const updatedProfiles: ChatMemberProfile[] = userProfiles.map((user) =>
        // user.userProfile.id === targetProfile.userProfile.id
          // ? { ...user, fadeMenuInfos: { ...user.fadeMenuInfos, isMuted: true } }
          // : user
      // );
      // console.log("updatedProfiles during mute = ", updatedProfiles);
      // dispatch(setUserProfiles(updatedProfiles));
    }
  };

  //   const handleUnMute	 = (newValue: boolean) => {
  //     // setChecked(newValue);
  //     // if (userId !== "") {
  //     setMuted(newValue);
  //     setMuteTimeLeft(0);
  //     mySocket.emit("UNMUTE_USER", {
  //       roomId: roomId,
  //       mutedUser: targetId,
  //     });
  //     // }
  //   };

  //   useEffect(() => {
  //     mySocket.on("MUTE_USER", (userId: string, timeLeft: number) => {
  //       if (timeLeft <= 0) {
  //         console.log("timeLeft RECEIVED MUTE_USER = ", timeLeft);
  //         setMuted(false);
  //         setMuteTimeLeft(0);
  //         const updatedProfiles = userProfiles.map((user) =>
  //           user.userProfile.id === targetId
  //             ? {
  //                 ...user,
  //                 fadeMenuInfos: { ...user.fadeMenuInfos, isMuted: false },
  //               }
  //             : user
  //         );
  //         dispatch(setUserProfiles(updatedProfiles));
  //       } else {
  //         setMuted(true);
  //         setMuteTimeLeft(timeLeft);
  //         console.log("muteTime = ", timeLeft);
  //       }
  //     });

  // mySocket.on("GET_MUTE_TIME", (data: number) => {
  //   setMuteTimeLeft(data);
  // });

  //     return () => {
  //       mySocket.off("MUTE_USER");
  //       // mySocket.off("GET_MUTE_TIME");
  //     };
  //   }, [dispatch, roomId, targetId, userProfiles]);

  return (
    <MenuItem
      onClick={() => {
        if (!targetProfile.fadeMenuInfos.isMuted) handleOpen();
        // else handleUnMute(!targetProfile.fadeMenuInfos.isMuted);
      }}
      className={`${quantico.className} w-full`}
    >
      <div className="flex flex-row justify-between w-full">
        {targetProfile.fadeMenuInfos.isMuted ? (
          <span>Unmute : {muteTimeLeft}s left </span>
        ) : (
          <span>Mute</span>
        )}
      </div>
      <MuteModal
        open={open}
        handleClose={handleClose}
        handleMute={handleMute}
        value={!targetProfile.fadeMenuInfos.isMuted}
      ></MuteModal>
    </MenuItem>
  );
}
