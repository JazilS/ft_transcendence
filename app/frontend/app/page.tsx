"use client";
import LogPageLayout from "./log/page";
import { press_Start_2P, quantico } from "@/models/Font/FontModel";
import "./../style/page.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { FormEvent, useState } from "react";
import Image from "next/image";
import "./styles.css";
import Cookies from "js-cookie";
import { useEffect } from "react";

function LogPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleButtonClick = (event: FormEvent) => {
    setIsLoading(true);
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    if (clientId && redirectUri) {
      window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code`;
    } else {
      console.error("Environment variables not properly set.");
    }
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
      )}
    </div>
  );
}

export default function Home() {
  // const accessToken = Boolean(Cookies.get("accessToken"));

  // useEffect(() => {
  //   if (accessToken) window.location.href = "/home";
  // }, []);
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
          <LogPage />
        </div>
      </div>
    </Provider>
  );
}
