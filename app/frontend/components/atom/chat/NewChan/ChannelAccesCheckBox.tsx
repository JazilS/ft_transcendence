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
    <div className="mt-5">
      <h1 className={`text-xl text-left mb-3 ${quantico.className}`}>
        Chose channel accessibility :
      </h1>
      <div
        className={`flex flex-row justify-center space-x-24 ml-8 ${quantico.className}`}
      >
        <div className="space-x-3">
          <span>Public :</span>
          <input
            checked={access === "PUBLIC"}
            type="radio"
            id="PUBLIC"
            name="access"
            value="PUBLIC"
            onChange={(event) => setAccess(event.target.value)}
          />
        </div>
        <div className="space-x-3">
          <span>Private :</span>
          <input
            checked={access === "PRIVATE"}
            type="radio"
            id="PRIVATE"
            name="access"
            value="PRIVATE"
            onChange={(event) => setAccess(event.target.value)}
          />
        </div>
        <div className="space-x-3">
          <span>Protected :</span>
          <input
            checked={access === "PROTECTED"}
            type="radio"
            id="PROTECTED"
            name="access"
            value="PROTECTED"
            onChange={(event) => setAccess(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
