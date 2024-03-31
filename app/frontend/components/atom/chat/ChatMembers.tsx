import { useState } from "react";
import FadeMenu from "../../molecules/chat/FadeMenu/FadeMenu";
import "@/style/ChatMembers.css";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Button from "../Button";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";
import RoomData from "@/models/ChatRoom/RoomData";
import { RootState } from "@/app/store/store";
import User from "@/models/User/UserModel";

export default function ChatMembers() {
  const roomOn: RoomData = useAppSelector((state) => state.chatRooms.roomOn);
  const user: User = useAppSelector((state: RootState) => state.user.user);
  const [target, setTarget] = useState<ChatMemberProfile>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className="h-[95%] mt-9 w-[20%] bg-[#BC80D0] rounded-3xl">
      <h1 className="text-3xl pl-[18%] pb-[5%] pt-[3%] ">Chat Members</h1>
      <div className={"h-[90%] w-full scrollbar-hide_3"}>
        <ul>
          {roomOn.users.map((roomUser: ChatMemberProfile) => (
            <li key={roomUser.userProfile.id}>
              <Button
                className={` pl-9 w-[100%] ${roomUser.userProfile.id === user.playerProfile.id ? "bg-[#e594ee]" : "hover:bg-[#f28eff]"}`}
                variant={"chatMember"}
                size={"channel"}
                infos={roomUser.fadeMenuInfos}
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  if (roomUser.userProfile.id !== user.playerProfile.id) {
                    console.log(roomUser);
                    setTarget(roomUser);
                    handleClick(event);
                  }
                }}
              >
                {roomUser.userProfile.name}
              </Button>
              <FadeMenu
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                open={open}
                target={target}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
