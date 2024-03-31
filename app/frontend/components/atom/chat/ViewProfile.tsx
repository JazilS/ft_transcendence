"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "@/app/styles.css";
import Button from "@/components/atom/Button";
import RoomData from "@/models/ChatRoom/RoomData";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { ChatMemberProfile } from "@/models/ChatRoom/ChatMemberProfile";
import { MenuItem } from "@mui/material";
import { quantico } from "@/models/Font/FontModel";
import PlayerProfile from "../../molecules/PlayerProfile";
import {
  useAddFriendMutation,
  useGetConnectedUserQuery,
  useGetProfileByIdMutation,
  useRemoveFriendMutation,
} from "@/app/store/features/User/user.api.slice";
import { error } from "console";
import { UserProfile } from "@/models/ProfilePageModel";
import { ConnectSocket, mySocket } from "@/app/utils/getSocket";
import User from "@/models/User/UserModel";
import { RootState } from "@/app/store/store";
import {
  getChatRoomsInLocal,
  setAllData,
} from "@/app/store/features/User/UserSlice";
import { updateUsers } from "@/app/store/features/ChatRoom/ChatRoomSlice";
import { useGetChatRoomsInMutation } from "@/app/store/features/ChatRoom/ChatRoom.api.slice";
import ChatRoom from "@/models/ChatRoom/ChatRoomModel";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%", // chelou un peu
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
  const [addFriendApi] = useAddFriendMutation();
  const [removeFriendApi] = useRemoveFriendMutation();
  const [getChannels] = useGetChatRoomsInMutation();
  const [open, setOpen] = React.useState<boolean>(false);
  const [target, setTarget] = React.useState<UserProfile | undefined>(
    undefined
  );
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useAppDispatch();
  const user: User = useAppSelector((state: RootState) => state.user.user);
  const roomOn: RoomData = useAppSelector(
    (state: RootState) => state.chatRooms.roomOn
  );
  // const roomOnId: string = useAppSelector(
  //   (state: RootState) => state.chatRooms.roomOnId
  // );
  const response = useGetConnectedUserQuery({});

  // fetch user
  React.useEffect(() => {
    if (!mySocket) ConnectSocket();
    let user: User;
    if (response.data) {
      user = response.data as User;
      console.log("user : ", user);
      dispatch(setAllData(user));
    }
  }, [dispatch, response.data]);

  // fetch chat rooms
  React.useEffect(() => {
    async function FetchChannels() {
      const response = await getChannels({});
      if ("data" in response) {
        dispatch(getChatRoomsInLocal(response.data));
        response.data.map((channel: ChatRoom) => {
          mySocket.emit("JOIN_SOCKET_ROOM", {
            room: channel.id,
          });
        });
      } else {
        console.error("Error during API call for chat rooms:", response.error);
      }
    }
    FetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfileById({
        userId: targetId ? targetId : "",
      });
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAA", profile);
      if ("data" in profile) {
        setTarget({
          id: profile.data.id ? profile.data.id : "",
          name: profile.data.name ? profile.data.name : "",
          imageSrc: profile.data.imageSrc ? profile.data.imageSrc : "",
          isConnected: profile.data.isConnected
            ? profile.data.isConnected
            : false,
        });
      } else if ("error" in profile) {
        console.log("error fetching Profile", profile);
      }
    };

    fetchProfile();
  }, []);

  const handleAddFriend = async () => {
    handleClose();
    if (user.playerProfile.id !== "") {
      await addFriendApi({
        friend: target?.id as string,
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
        targetId: target?.id,
        targetName: target?.name,
        dmRoom: "",
      });
    }
  };

  const handleRemoveFriend = async () => {
    if (user.playerProfile.id !== "") {
      await removeFriendApi({
        friend: target?.id as string,
      })
        .then((response) => {
          if ("data" in response && "data" in response.data) {
            console.log("response FROM REMOVEFRIEND", response);
            mySocket.emit("REMOVE_FRIEND", {
              userId: user.playerProfile.id,
              userName: user.playerProfile.name,
              targetId: target?.id,
              targetName: target?.name,
              roomId: response.data.data,
            });
          }
        })
        .catch((error) => {
          console.log("error FROM REMOVEFRIEND", error);
        });
    }
  };

  const handleBlock = (newValue: boolean) => {
    console.log("Block");
    if (user.playerProfile.id !== "") {
      mySocket.emit("BLOCK_USER", {
        blockerId: user.playerProfile.id,
        blockedUserId: target?.id,
        value: !newValue,
      });
      const updatedUsers: ChatMemberProfile[] = roomOn.users.map(
        (user: ChatMemberProfile) => {
          if (user.userProfile.id === target?.id) {
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
          <div className="flex flex-col justify-end items-end">
            <Button
              onClick={handleClose}
              className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full "
            >
              X
            </Button>
          </div>
          <div className="flex flex-row space-x-20 justify-center items-center ">
            <div className="flex flex-col justify-center items-center space-y-3">
              <PlayerProfile
                user={targetId ? target : undefined}
                width={200}
                height={200}
                displayName={true}
              />
              <div
                className={`rounded-full h-3 w-3 ${
                  target?.isConnected ? "bg-green-600" : "bg-red-600"
                }`}
              />
            </div>
            <div className="flex flex-col justify-center items-center space-y-5">
              {roomOn.users.find(
                (user: ChatMemberProfile) => user.userProfile.id === target?.id
              )?.fadeMenuInfos.isFriend === false ? (
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={handleAddFriend}
                >
                  Add Friend
                </Button>
              ) : (
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={handleRemoveFriend}
                >
                  Remove from Friends
                </Button>
              )}
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                // onClick={handleInviteInGame}
              >
                Invite In a Game
              </Button>
              {roomOn.users.find(
                (user: ChatMemberProfile) => user.userProfile.id === target?.id
              )?.fadeMenuInfos.isBlocked ? (
                <>
                  <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => {
                      handleBlock(false);
                    }}
                  >
                    Unblock
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => {
                    handleBlock(true);
                  }}
                >
                  Block
                </Button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
