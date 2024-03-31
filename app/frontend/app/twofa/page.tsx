"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import Cookies from "js-cookie";
import { quantico } from "@/models/Font/FontModel";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

export default function Twofa() {
  const [userCode, setUserCode] = useState<string>("");
  const pathName = usePathname();
  const accessToken = Boolean(Cookies.get("accessToken"));
  const twofa = Boolean(Cookies.get("2fa"));
  const [response, setResponse] = useState<boolean>(true);

  useEffect(() => {
    if ((accessToken || !twofa) && pathName !== "/") window.location.href = "/";
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await axios
      .post(
        "http://localhost:4000/api/twofa/validate",
        {
          secret: userCode,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("2fa")}`,
          },
          withCredentials: true,
        }
      )
      .then((response: { data: { success: string } }) => {
        console.log(response.data);
        if (!response.data) {
          setUserCode("");
          setResponse(false);
        } else {
          Cookies.remove("2fa");
          const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
          const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
      
          if (clientId && redirectUri) {
            window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
              redirectUri
            )}&response_type=code`;
          } else {
            console.error("Environment variables not properly set.");
          }
        }
      })
      .catch((error: any) => {
        Cookies.remove("2fa");
        console.error("Error verifying code:", error);
      });
  };

  useEffect(() => {
    if (!response) setTimeout(() => setResponse(false), 3000);
  }, [response]);
  return (
    <Provider store={store}>
      <div
        className={`flex flex-col items-center justify-evenly space-y-7 mt-[8%] ${quantico.className}`}
      >
        <h1 className="text-5xl mb-8">Enter 2FA Code</h1>
        <form onSubmit={handleSubmit} className="">
          <input
            type="text"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder={response ? "Enter your code" : "Bad Code, Try Again"}
            className="bg-white rounded-full px-3 py-2"
          />
          <button
            type="submit"
            className="ml-4 bg-indigo-700  text-white rounded-full px-3 py-2 active:scale-90 "
          >
            Submit
          </button>
        </form>
      </div>
    </Provider>
  );
}
