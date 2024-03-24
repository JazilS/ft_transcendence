// 'use client'
// import React from "react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

// export default function twoFA_qrCodePage() {
//     const [url, setUrl] = useState<string>("");
//     const [userCode, setUserCode] = useState<string>("");

//     useEffect(() => {
//         console.log('Component rendered');
//         const fetchData = async () => {
//             console.log('useEffect called');
//             await axios.get("http://localhost:4000/api/twofa/setup", {
//                 headers: {
//                     Authorization: `Bearer ${Cookies.get("accessToken")}`,
//                 },
//                 withCredentials: true,
//             }).then((response: { data: { qrCode: string } }) => {
//                 console.log("jai recu la reponse", response.data.qrCode);
//                 setUrl(response.data.qrCode);
//             }).catch((error: any) => {
//                 console.error("Error fetching QR code URL:", error);
//             })
//         };

//         fetchData();
//     }, []);

//     return (
//         <div className="flex flex-col items-center justify-evenly">
//             <img src={url} alt="QR Code" />
//         </div>
//     );
// }
"use client";
import React, { FormEvent, useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { quantico } from "@/models/Font/FontModel";

export default function TwoFAQRCodePage() {
  const [url, setUrl] = useState<string>("/Loading.png");
  const [userCode, setUserCode] = useState<string>("");

  useEffect(() => {
    console.log("Component rendered");
    const fetchData = async () => {
      console.log("useEffect called");
      await axios
        .get("http://localhost:4000/api/twofa/setup", {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          withCredentials: true,
        })
        .then((response: { data: { qrCode: string } }) => {
          console.log("jai recu la reponse", response.data.qrCode);
          setUrl(response.data.qrCode);
        })
        .catch((error: any) => {
          console.error("Error fetching QR code URL:", error);
        });
    };

    fetchData();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await axios
      .post(
        "http://localhost:4000/api/twofa/validate",
        {
          secret: userCode,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          withCredentials: true,
        }
      )
      .then((response: { data: { success: string } }) => {
        console.log("Code verification state:", response.data);
      })
      .catch((error: any) => {
        console.error("Error verifying code:", error);
      });
  };

  return (
    <div
      className={`flex flex-col items-center justify-evenly space-y-7 mt-[8%] ${quantico.className}`}
    >
      <h1 className="text-5xl mb-8">Scan this QrCode</h1>
      <Image
        src={url}
        alt="QR Code"
        width={400}
        height={400}
        className="rounded-3xl"
      />
      <form onSubmit={handleSubmit} className="">
        <input
          type="text"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="Enter your code"
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
  );
}
