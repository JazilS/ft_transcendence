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
  const [response, setResponse] = useState<boolean>(false);

  useEffect(() => {
    const fetchIsActive = async () => {
      await axios
        .get("http://localhost:4000/api/twofa/isActive", {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          withCredentials: true,
        })
        .then((response: { data: boolean }) => {
          if (response.data) fetchDisable();
          else fetchData();
          console.log("is activate response:", response.data);
        })
        .catch((error: any) => {
          console.error("Error getting isActive:", error);
        });
    };
    const fetchDisable = async () => {
      await axios
        .get("http://localhost:4000/api/twofa/disable", {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          withCredentials: true,
        })
        .then(() => {
          console.error("2fa disabled");
          window.location.href = "/";
        })
        .catch((error: any) => {
          console.error("Error desactivating:", error);
          window.location.href = "/";
        });
    };
    const fetchData = async () => {
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
    fetchIsActive();
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
        if (response.data) setResponse(true);
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
    {response ? (
      <p style={{ fontSize: "3vh" }}>2FA ACTIVATED !</p>
    ) : (
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
    )}
    </div>
  );
}
