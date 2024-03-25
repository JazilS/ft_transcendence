"use client";

import { press_Start_2P, quantico } from "@/models/Font/FontModel";
import "../../style/page.css";
import { Provider } from "react-redux";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { RootState, store } from "../store/store";
import { connectSocket } from "../utils/getSocket";
import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { setAllData } from "../store/features/User/UserSlice";
import axios from "axios";
import Cookies from "js-cookie";


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

  // Assuming you have a selector to get the updated state from the store
  // const updatedState = useAppSelector((state: RootState) => state.user);

  // useEffect(() => {
  //   if (updatedState) {
  //     connectSocket();
  //   }
  // }, [updatedState]);

  // const handleconnectSocket = () => {
  //   connectSocket();
  // };

  const [isLoading, setIsLoading] = useState<boolean>(false);


  // const handleSubmit = async (event: FormEvent) => {
  //   event.preventDefault();
  //   const response = await axios
  //     .post(
  //       "http://localhost:4000/api/twofa/validate",
  //       {
  //         secret: userCode,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("accessToken")}`,
  //         },
  //         withCredentials: true,
  //       }
  //     )
  //     .then((response: { data: { success: string } }) => {
  //       console.log("Code verification state:", response.data);
  //     })
  //     .catch((error: any) => {
  //       console.error("Error verifying code:", error);
  //     });
  // };

  const handleButtonClick = (event: FormEvent) => {
    setIsLoading(true);
    window.location.href =
      // `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.UID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`;
      "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f5c20fa75a6d24063ccbf4571c48ac0b0379caf31268a8018b0dc3a7076b9fac&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fauth%2Flogin&response_type=code";
    // connectSocket();
  };

  return (
    <div className="flex flex-col items-center justify-evenly">
      <div className={` text-black text-7xl ${press_Start_2P.className}`}>
        PONG
      </div>
      {!isLoading ? (
        <button
          className={`text-white text-xl bg-gradient-to-r from-fuchsia-900 to-indigo-900  rounded-lg p-1 pl-14 pr-14  ${quantico.className}`}
          onClick={handleButtonClick}
        >
          Login with 42
        </button>
      ) : (
        <Image
          src="/Loading.png"
          alt="Loading"
          width={200}
          height={200}
          className="animate-pulse"
        />
        // <div className="text-white text-xl bg-gradient-to-r from-fuchsia-900 to-indigo-900  rounded-lg p-1 pl-14 pr-14  animate-pulse">
        // Loading...
        // </div>
      )}
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
