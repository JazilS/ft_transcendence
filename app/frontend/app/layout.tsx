"use client";

import MyHeader from "@/components/organism/Header";
import Home from "./page.tsx";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import dotenv from 'dotenv';
dotenv.config();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const [accessToken, setAccessToken] = useState(true);

  useEffect(() => {
    setAccessToken(Boolean(Cookies.get("accessToken")));
    console.log(accessToken);
    if (!accessToken && isValidURL() && pathName !== "/")
      window.location.href = "/";
  }, [accessToken]);

  const isValidURL = () => {
    if (
      pathName === "/game" ||
      pathName === "/chat" ||
      pathName === "/home" ||
      pathName === "/lobby" ||
      pathName === "/profile" ||
      pathName === "/qrCode" ||
      pathName === "/"
    )
      return true;
    return false;
  };

  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[90vh]">
        {accessToken && <MyHeader display={true} />}
        {accessToken || !isValidURL() ? children : <Home />}
      </body>
    </html>
  );
}
