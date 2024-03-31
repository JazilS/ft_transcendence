import Button from "../../../atom/Button";
// import CheckBoxMenuItem from "../../../atom/CheckBox";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import "@/style/FadeMenu.css";
import { Dispatch, SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { mySocket } from "@/app/utils/getSocket";
import { quantico } from "@/models/Font/FontModel";
import { updateUsers } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";
import {
  useAddFriendMutation,
  useRemoveFriendMutation,
} from "@/app/store/features/User/user.api.slice";
import ViewProfile from "@/components/atom/chat/ViewProfile";
import { PongEvent } from "../../../../shared/socketEvent";
import { PongGameType } from "../../../../shared/constant";

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
  const userRole = roomOn.users.find(
    (user: ChatMemberProfile) => user.userProfile.id === user.userProfile.id
  )?.role;
  const dispatch = useAppDispatch();
  const [addFriendApi] = useAddFriendMutation();
  const [removeFriendApi] = useRemoveFriendMutation();

  const handleAddFriend = async () => {
    handleClose();
    if (user.playerProfile.id !== "") {
      const response = await addFriendApi({
        friend: target?.userProfile.id as string,
      })
        .then((response) => {
          console.log("response FROM ADDFRIEND", response);
        })
        .catch((error) => {
          console.log("error FROM ADDFRIEND", error);
        });
      mySocket.emit("ADD_FRIEND", {
        userId: user.playerProfile.id,
        userName: user.playerProfile.name,
        targetId: target?.userProfile.id,
        targetName: target?.userProfile.name,
        dmRoom: "",
      });
    }
  };

  const handleRemoveFriend = async () => {
    handleClose();
    if (user.playerProfile.id !== "") {
      await removeFriendApi({
        friend: target?.userProfile.id as string,
      })
        .then((response) => {
          if ("data" in response && "data" in response.data) {
            console.log("response FROM REMOVEFRIEND", response);
            mySocket.emit("REMOVE_FRIEND", {
              userId: user.playerProfile.id,
              userName: user.playerProfile.name,
              targetId: target?.userProfile.id,
              targetName: target?.userProfile.name,
              roomId: response.data.data,
            });
          }
        })
        .catch((error) => {
          console.log("error FROM REMOVEFRIEND", error);
        });
    }
  };

  const handlePromote = () => {
    handleClose();
    mySocket.emit("PROMOTE_USER", {
      targetId: target?.userProfile.id,
      roomOnId: roomOn.roomInfos.id,
    });
  };

  const handleBan = () => {
    handleClose();
    if (mySocket)
      mySocket.emit("LEAVE_ROOM", {
        room: roomOn.roomInfos.id,
        userName: target?.userProfile.name,
        userId: target?.userProfile.id,
        leavingType: "BANNED",
      });
    else console.log("No socket");
  };

  const handleKick = () => {
    handleClose();
    if (mySocket)
      mySocket.emit("LEAVE_ROOM", {
        room: roomOn.roomInfos.id,
        userName: target?.userProfile.name,
        userId: target?.userProfile.id,
        leavingType: "KICKED",
      });
    else console.log("No socket");
  };

  const handleBlock = (newValue: boolean) => {
    handleClose();
    if (user.playerProfile.id !== "") {
      mySocket.emit("BLOCK_USER", {
        blockerId: user.playerProfile.id,
        blockedUserId: target?.userProfile.id,
        value: !newValue,
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

  const handleInviteInNormalGame = (pongType: PongGameType) => {
    if (user.playerProfile.id !== "") {
      mySocket.emit(PongEvent.SEND_GAME_INVITATION, {
        id: target?.userProfile.id,
        pongType,
      });
    }
    handleClose();
  };

  const handleOpenProfile = () => {
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
        {/* VIEW PROFILE */}
        <ViewProfile targetId={target?.userProfile.id} />

        {/* ADD FRIEND */}
        {target?.fadeMenuInfos.isFriend === false ? (
          <MenuItem
            onClick={() => {
              console.log("target = ", target);
              handleAddFriend();
            }}
            className={`${quantico.className} w-full`}
          >
            Add Friend
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              console.log("target = ", target);
              handleRemoveFriend();
            }}
            className={`${quantico.className} w-full`}
          >
            Remove Friend
          </MenuItem>
        )}

        {/* BLOCK */}
        <MenuItem
          onClick={() => {
            console.log("target = ", target);
            if (target?.fadeMenuInfos.isBlocked === false) handleBlock(true);
            else if (target?.fadeMenuInfos.isBlocked === true)
              handleBlock(false);
            else console.log("PROBLEM WITH BLOCK MENU ITEM ----------");
          }}
          className={`${quantico.className} w-full`}
        >
          {target?.fadeMenuInfos.isBlocked ? "Unblock" : "Block"}
        </MenuItem>

        {/* INVITE IN NORMAL GAME */}
        <MenuItem
          onClick={() => {
            handleInviteInNormalGame("NORMAL");
          }}
          className={`${quantico.className} w-full`}
        >
          Invite In Normal Game
        </MenuItem>

        {/* INVITE IN SPECIAL GAME */}
        <MenuItem
          onClick={() => {
            handleInviteInNormalGame("SPECIAL");
          }}
          className={`${quantico.className} w-full`}
        >
          Invite In Game
        </MenuItem>

        {/* PROMOTE IN CHANNEL */}
        {target?.role === "MEMBER" &&
          roomOn.roomInfos.roomType !== "DM" &&
          (userRole === "CREATOR" || userRole === "ADMIN") && (
            <MenuItem
              onClick={() => {
                handleClose();
                handlePromote();
              }}
              className={`${quantico.className} w-full`}
            >
              Promote
            </MenuItem>
          )}

        {/* MUTE */}
        {target?.fadeMenuInfos.role !== "CREATOR" &&
          roomOn.roomInfos.roomType !== "DM" &&
          userRole !== "MEMBER" && (
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
          )}

        {/* KICK */}
        {target?.fadeMenuInfos.role !== "CREATOR" &&
          roomOn.roomInfos.roomType !== "DM" &&
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
          )}

        {/* BAN */}
        {target?.fadeMenuInfos.role !== "CREATOR" &&
          userRole !== "MEMBER" &&
          roomOn.roomInfos.roomType !== "DM" && (
            <MenuItem
              onClick={() => {
                handleClose();
                handleBan();
              }}
              className={`${quantico.className} w-full`}
            >
              Ban
            </MenuItem>
          )}
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
