import React from "react";
import { press_Start_2P, quantico } from "@/models/Font/FontModel";

export default function ChannelAccesCheckBox({
  access,
  setAccess,
}: {
  access: string;
  setAccess: (value: string) => void;
}) {
  return (
    <>
      <h1 className={`text-sm text-left mb-5 ${press_Start_2P.className}`}>
        Chose channel accessibility :
      </h1>
      <div
        className={`flex flex-row justify-center space-x-24 ml-8 ${quantico.className}`}
      >
        <div className="space-x-3">
          <span>Public :</span>
          <input
            checked={access === "public"}
            type="radio"
            id="public"
            name="access"
            value="public"
            onChange={(event) => setAccess(event.target.value)}
          />
        </div>
        <div className="space-x-3">
          <span>Private :</span>
          <input
            checked={access === "private"}
            type="radio"
            id="private"
            name="access"
            value="private"
            onChange={(event) => setAccess(event.target.value)}
          />
        </div>
        <div className="space-x-3">
          <span>Protected :</span>
          <input
            checked={access === "protected"}
            type="radio"
            id="protected"
            name="access"
            value="protected"
            onChange={(event) => setAccess(event.target.value)}
          />
        </div>
      </div>
    </>
  );
}
