import Button from "../../../atom/Button";
import CheckBoxMenuItem from "../../../atom/CheckBox";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import "@/style/FadeMenu.css";
import {
  useGetFadeMenuInfosMutation,
  useLeaveChatroomMutation,
} from "@/app/store/features/User/user.api.slice";
import { use, useEffect, useState } from "react";
import FadeMenuInfos from "@/models/ChatRoom/FadeMenuInfos";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { info } from "console";
import { usePromoteUserInChatRoomMutation } from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import { mySocket } from "@/app/utils/getSocket";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";
import { quantico } from "@/models/FontModel";
import { leaveChatroom } from "@/app/store/features/User/UserSlice";

export default function FadeMenu({
  targetName,
  targetId,
  active,
  targetRole,
  userRole,
  setUserRole,
  setRoomOnId,
  roomOn,
}: {
  targetName: string;
  targetId: string;
  active: boolean;
  targetRole: string;
  userRole: string;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
  setRoomOnId: React.Dispatch<React.SetStateAction<string>>;
  roomOn: ChatRoom;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [infos, setInfos] = useState<FadeMenuInfos>({
    isBanned: false,
    isBlocked: false,
    isConnected: false,
    isFriend: false,
    isInvited: false,
    isKicked: false,
    isMuted: false,
    role: "",
  });
  const open = Boolean(anchorEl);

  const user = useAppSelector((state) => state.user.user);
  const [getFadeMenuInfos] = useGetFadeMenuInfosMutation();

  useEffect(() => {
    const fetchFadeMenuInfos = async () => {
      const response:
        | { data: FadeMenuInfos }
        | { error: FetchBaseQueryError | SerializedError } =
        await getFadeMenuInfos({
          userId: user.playerProfile.id,
          targetId: targetId,
          roomId: roomOn.id,
        });
      if ("data" in response) {
        setInfos(response.data);
      } else {
        console.error(
          "Error during API call for fade menu infos:",
          response.error
        );
      }
    };
    fetchFadeMenuInfos();
  }, [anchorEl, getFadeMenuInfos, roomOn.id, targetId, user]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log(
      "targetName : ",
      targetName,
      "targetId : ",
      targetId,
      "active : ",
      active,
      "targetRole : ",
      targetRole,
      "infos : ",
      infos
    );

    if (active) setAnchorEl(event.currentTarget);
  };

  const handlePromote = () => {
    console.log("IN HNADLE PROMOTE_USER");
    mySocket.emit("PROMOTE_USER", { targetId: targetId, roomOnId: roomOn.id });
    setUserRole("ADMIN");
  };

  const [leaveChannel] = useLeaveChatroomMutation();
  const dispatch = useAppDispatch();

  const handleKick = () => {
    // leave from db
    // leaveChannel({ userId: targetId, roomId: roomOn.id });
    // dispatch(leaveChatroom(roomOn.id));
    if (mySocket)
      mySocket.emit("LEAVE_ROOM", {
        room: roomOn.id,
        userName: targetName,
        userId: targetId,
        leavingType: "KICKED",
      });
    else console.log("No socket");
    // setRoomOnId("");

    // console.log("IN HANDLE KICK");
    // if (mySocket)
    //   mySocket.emit("LEAVE_ROOM", {
    //     room: roomOn.id,
    //     userName: targetId,
    //     leavingType: "KICKED",
    //   });
  };

  useEffect(() => {
    if (mySocket) {
      mySocket.on("PROMOTE_USER", async () => {
        console.log(" i have been promoted to ADMIN");
        setUserRole("ADMIN");
        setInfos({ ...infos, role: "ADMIN" });
      });
    }
    return () => {
      mySocket.off("PROMOTE_USER");
    };
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="w-[100%]">
      <Button
        className="hover:bg-[#f28eff] pl-9 w-[100%]"
        variant={"publicChannel"}
        size={"channel"}
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {targetName}
      </Button>
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
        {active && (
          <CheckBoxMenuItem
            userId={user.playerProfile.id}
            targetId={targetId}
            isBlocked={infos.isBlocked}
          ></CheckBoxMenuItem>
        )}

        {active &&
          infos.role === "MEMBER" &&
          (userRole === "CREATOR" || userRole === "ADMIN") && (
            <MenuItem
              onClick={() => {
                console.log("userRole", userRole);
                console.log("targetRole", targetRole);
                handleClose();
                handlePromote();
              }}
              className={`${quantico.className} w-full`}
            >
              Promote in channel
            </MenuItem>
          )}

        {active && infos.role !== "CREATOR" && userRole !== "MEMBER" && (
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

        {/* <MenuItem onClick={handleClose}>
          Profile
        </MenuItem> */}
        {/* seulement si ils ne sont pas amis */}
        {/* <MenuItem onClick={handleClose}>Add Friend</MenuItem>
        <MenuItem onClick={handleClose}>Send message</MenuItem>
        <MenuItem onClick={handleClose}>Invite in game</MenuItem> */}

        {/* <CheckBoxMenuItem value="mute"></CheckBoxMenuItem> */}

        {/* ajouter ces options pour les operateurs */}
        {/* <MenuItem>Kick from channel</MenuItem> */}
        {/* <MenuItem>Ban from channel</MenuItem> */}
        {/* seulement si l'utilisateur n'est pas deja promu */}
      </Menu>
    </div>
  );
}

/**
 * TODO : differentes possibilites de menu
 * !    Group Room ->
 * * 1. Version membre non operateur : Profile, Add Friend, Send message, Invite in game, block
 * * 2. Version operateur : ... + mute, kick, ban, promote
 * *    - un operateur non createur du channel ne peux pas agir sur le createur
 * * 3. Si l'utilisateur clique sur son propre nom, rien ne se passe
 
 * !    Private Room ->
 * * 1. seulement les options suivantes : Profile, Invite in game, block
 * * 2. Si l'utilisateur clique sur son propre nom, rien ne se passe
 * 
 * */
