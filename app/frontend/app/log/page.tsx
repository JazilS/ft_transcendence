"use client";

import { press_Start_2P, quantico } from "@/models/Font/FontModel";
import Link from "next/link";
import "../../style/page.css";
import { Provider, useSelector } from "react-redux";
import { setAllData } from "../store/features/User/UserSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { store } from "../store/store";
import { useAuthQuery, useRegisterMutation } from "../store/features/User/user.api.slice";
import { Socket, io } from "socket.io-client";
import { connectSocket, mySocket } from "../utils/getSocket";
import { useEffect } from "react";

function LogPage() {
  // const [auth] = useAuthQuery();

  // const handleNewUser = async () => {
  //   const response = useAuthQuery(null);

  //   if ("error" in response) {
  //     // Handle error here
  //     console.error(response.error);
  //   } else {
  //     // dispatch(setAllData(response.data));
  //     // console.log(response.data);
  //   }
  // };

  // const authQuery = useAuthQuery({});
  
  // useEffect(() => {
  //   // Effect to run when authQuery changes
  // }, [authQuery]);


  // const handleClick = () => {
  //   // Call useAuthQuery when the button is clicked
  //   const authQuery = useAuthQuery({});
    
  //   if ("error" in authQuery) {
  //     console.error(authQuery.error);
  //   } else {
  //     // Dispatch action or perform other logic with response data
  //     // dispatch(setAllData(authQuery.data));
  //     // console.log(authQuery.data);
  //   }
  // };


  // Assuming you have a selector to get the updated state from the store
  const updatedState = useAppSelector((state) => state.user);

  useEffect(() => {
    if (updatedState) {
      connectSocket();
    }
  }, [updatedState]);

  const handleconnectSocket = () => {
    connectSocket();
  };

  // const handleButtonClick = async () => {
  //   const response = await fetch('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f5c20fa75a6d24063ccbf4571c48ac0b0379caf31268a8018b0dc3a7076b9fac&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Flogin&response_type=code');
  //   const data = await response.json();
  //   console.log(data);
  //   // handleNewUser();
  //   // handleconnectSocket();
  // };

  const handleButtonClick = () => {
    window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f5c20fa75a6d24063ccbf4571c48ac0b0379caf31268a8018b0dc3a7076b9fac&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fauth%2Flogin&response_type=code";
  };

  return (
    <div className="flex flex-col items-center justify-evenly">
      {/* <MyHeader display={false} /> */}
      <div className={` text-black text-7xl ${press_Start_2P.className}`}>
        PONG
      </div>
      {/* <Link href ="/https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f5c20fa75a6d24063ccbf4571c48ac0b0379caf31268a8018b0dc3a7076b9fac&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Flogin&response_type=code"> */}
        <button
          className={`text-white text-xl bg-gradient-to-r from-fuchsia-900 to-indigo-900  rounded-lg p-1 pl-14 pr-14  ${quantico.className}`}
          onClick={handleButtonClick}
          // onClick={() => {

          //   // handleClick();
          //   // handleNewUser();
          //  /* handleconnectSocket(); */
          // }}
        >
          Login with 42
        </button>
      {/* </Link> */}
    </div>
  );
}

export default function LogPageLayout() {
  return (
    <Provider store={store}>
      <div className="flex flex-col h-[100vh] bg-gradient-to-r from-indigo-500 to-fuchsia-500">
        <div className="bg-black h-[8vh] flex items-center ">
          <span
            className={`items-center bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-transparent text-2xl pl-48 ${press_Start_2P.className}`}
          >
            FT_TRANSCENDENCE
          </span>
        </div>
        <div className="h-[100%] flex pb-20 justify-evenly">
          <LogPage></LogPage>
        </div>
      </div>
    </Provider>
  );
}
