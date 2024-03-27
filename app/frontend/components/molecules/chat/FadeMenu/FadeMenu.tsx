import Button from "../../../atom/Button";
// import CheckBoxMenuItem from "../../../atom/CheckBox";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import "@/style/FadeMenu.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FadeMenuInfos from "@/models/ChatRoom/FadeMenuInfos";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { mySocket } from "@/app/utils/getSocket";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { quantico } from "@/models/Font/FontModel";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import { updateRole, updateUsers } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import Mute from "@/components/atom/chat/mute/mute";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";

export default function FadeMenu({
  anchorEl,
  setAnchorEl,
  open,
  target,
}: {
  anchorEl: HTMLElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
  open: boolean;
  target: ChatMemberProfile | undefined;
}) {
  const user = useAppSelector((state) => state.user.user);
  const roomOn = useAppSelector((state) => state.chatRooms.roomOn);
  const dispatch = useAppDispatch();

  // const handlePromote = () => {
  //   mySocket.emit("PROMOTE_USER", {
  //     targetId: targetProfile.userProfile.id,
  //     roomOnId: roomOn.id,
  //   });
  //   setUserRole("ADMIN");
  // };

  // const handleKick = () => {
  //   if (mySocket)
  //     mySocket.emit("LEAVE_ROOM", {
  //       room: roomOn.id,
  //       userName: targetProfile.userProfile.name,
  //       userId: targetProfile.userProfile.id,
  //       leavingType: "KICKED",
  //     });
  //   else console.log("No socket");
  // };

  // const handleBan = () => {
  //   if (mySocket)
  //     mySocket.emit("LEAVE_ROOM", {
  //       room: roomOn.id,
  //       userName: targetProfile.userProfile.name,
  //       userId: targetProfile.userProfile.id,
  //       leavingType: "BANNED",
  //     });
  //   else console.log("No socket");
  // };

  // useEffect(() => {
  //   if (mySocket) {
  //     mySocket.on("PROMOTE_USER", async () => {
  //       console.log(" i have been promoted to ADMIN");
  //       setUserRole("ADMIN");
  //       dispatch(
  //         updateRole({ targetId: targetProfile.userProfile.id, role: "ADMIN" })
  //       );
  //       // setInfos({ ...infos, role: "ADMIN" });
  //     });
  //   }
  //   return () => {
  //     mySocket.off("PROMOTE_USER");
  //   };
  // });

  // useEffect(() => {
  //   if (mySocket) {
  //     mySocket.on("PROMOTE_USER", async () => {
  //       console.log(" i have been promoted to ADMIN");
  //       setUserRole("ADMIN");

  //       setInfos({ ...infos, role: "ADMIN" });
  //     });
  //   }
  //   return () => {
  //     mySocket.off("PROMOTE_USER");
  //   };
  // });

  const handleBlock = (newValue: boolean) => {
    handleClose();
    if (user.playerProfile.id !== "") {
      mySocket.emit("BLOCK_USER", {
        blockerId: user.playerProfile.id,
        blockedUserId: target?.userProfile.id,
        value: newValue,
      });
      const updatedUsers: ChatMemberProfile[] = roomOn.users.map(
        (user: ChatMemberProfile) => {
          if (user.userProfile.id === target?.userProfile.id) {
            return {
              ...user,
              fadeMenuInfos: {
                ...user.fadeMenuInfos,
                isBlocked: newValue,
              },
            };
          } else {
            return user;
          }
        }
      );
      dispatch(updateUsers(updatedUsers));
    }
  };

  const handleMute = () => {
    if (user.playerProfile.id !== "") {
      mySocket.emit("MUTE_USER", {
        roomId: roomOn.roomInfos.id,
        mutedUser: target?.userProfile.id,
        muterId: user.playerProfile.id,
      });
      handleClose();
      // dispatch(setUserProfiles(updatedProfiles));
    }
  };

  const handleUnMute = () => {
    if (user.playerProfile.id !== "") {
      mySocket.emit("UNMUTE_USER", {
        roomId: roomOn.roomInfos.id,
        mutedUser: target?.userProfile.id,
        muterId: user.playerProfile.id,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="w-[100%]">
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transitionDuration={150}
        TransitionComponent={Fade}
        className={`optionmembres ml-4`}
      >
        {/* MUTE */}
        <MenuItem
          onClick={() => {
            console.log("target = ", target);
            if (target?.fadeMenuInfos.isMuted === false) handleMute();
            else if (target?.fadeMenuInfos.isMuted === true) handleUnMute();
            else console.log("PROBLEM WITH MUTE MENU ITEM ----------");
          }}
          className={`${quantico.className} w-full`}
        >
          {target?.fadeMenuInfos.isMuted ? "Unmute" : "Mute"}
        </MenuItem>

        {/* BLOCK */}
        <MenuItem
          onClick={() => {
            console.log("target = ", target);
            if (target?.fadeMenuInfos.isBlocked === false) handleBlock(false);
            else if (target?.fadeMenuInfos.isBlocked === true) handleBlock(true);
            else console.log("PROBLEM WITH BLOCK MENU ITEM ----------");
          }}
          className={`${quantico.className} w-full`}
        >
          {target?.fadeMenuInfos.isMuted ? "Unblock" : "Block"}
        </MenuItem>
        {/* <CheckBoxMenuItem
          userId={user.playerProfile.id}
          roomId={roomOn.id}
          action="block"
        ></CheckBoxMenuItem> */}

        {/* // TODO MUTE :
          // eslint-disable-next-line react/jsx-no-comment-textnodes
        //! il reste des problemes, le timeout qui ne fonctionne pas et le
        //! logo qui se met a jour que si on clique sur le fade menu de la personnne



        // TODO : ADAPTER TOUT LE FADEMENU






        // * la restriction de message est bien effectuee, le logo change bien mais pas au bon moment */}
        {/* MUTE */}
        {/* {targetProfile.fadeMenuInfos.role !== "CREATOR" &&
          userRole !== "MEMBER" && ( */}
        {/* {console.log("targetProfile BEFORE MUTE", targetProfile)} */}
        {/* <Mute
          userId={user.playerProfile.id}
          targetProfile={targetProfile}
          roomId={roomOn.id}
        ></Mute> */}
        {/* )} */}
        {/* PROMOTE IN CHANNEL */}
        {/* {targetProfile.role === "MEMBER" &&
          (userRole === "CREATOR" || userRole === "ADMIN") && (
            <MenuItem
              onClick={() => {
                // console.log("userRole", userRole);
                // console.log("targetRole", targetProfile.role);
                handleClose();
                handlePromote();
              }}
              className={`${quantico.className} w-full`}
            >
              Promote in channel
            </MenuItem>
          )}
        {/* KICK */}
        {/* {targetProfile.fadeMenuInfos.role !== "CREATOR" &&
          userRole !== "MEMBER" && (
            <MenuItem
              onClick={() => {
                handleClose();
                handleKick();
              }}
              className={`${quantico.className} w-full`}
            >
              Kick
            </MenuItem>
          )} */}
        {/* BAN */}
        {/* {targetProfile.fadeMenuInfos.role === "MEMBER" &&
          userRole !== "MEMBER" && (
            <MenuItem
              onClick={() => {
                handleClose();
                handleBan();
              }}
              className={`${quantico.className} w-full`}
            >
              Ban
            </MenuItem>
          )}*/}
      </Menu>
    </div>
  );
}

/**
 * TODO : differentes possibilites de menu
 * !    Group Room ->
 * 1. Version membre non operateur :
 * *  Profile (redirige sur le profil public de la personne)
 * *  Invite in game (si la personne est connectee)
 * *  Add Friend (si ils ne sont pas deja amis)
 * *  Send message (si le chat existe deja, juste Join sinon creer le chatroom et join)
 * //  block
 * 2. Version operateur :
 * *  mute (temporairement (1mn, 10mn, 1h))
 * //  kick
 * //  ban
 * //  promote
 * //    - un operateur non createur du channel ne peux pas agir sur le createur
 * // 3. Si l'utilisateur clique sur son propre nom, rien ne se passe
 
 * !    Private Room ->
 * 1. seulement les options suivantes : 
 * * Profile
 * * Invite in game
 * // block
 * // 2. Si l'utilisateur clique sur son propre nom, rien ne se passe
 * 
 * ! Invite in Channel from public Profile Page
 * */
