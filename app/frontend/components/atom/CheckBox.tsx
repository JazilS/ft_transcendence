import { MenuItem } from "@mui/material";
import { quantico } from "@/models/Font/FontModel";
import { mySocket } from "@/app/utils/getSocket";
import { useAppSelector } from "@/app/store/hooks";
import { useState } from "react";
// import '../style/Checkbox.css'

export default function CheckBoxMenuItem({
  userId,
  targetId,
  isBlocked,
}: {
  userId: string;
  targetId: string;
  isBlocked: boolean;
}) {
  const [checked, setChecked] = useState<boolean>(isBlocked);

  const handleCheckbox = (newValue: boolean) => {
    setChecked(newValue);
    console.log("check value = ", checked);
    if (userId !== "") {
      mySocket.emit("BLOCK_USER", {
        blockerId: userId,
        blockedUserId: targetId,
        value: checked,
      });
    }
  };

  return (
    <MenuItem
      onClick={() => {
        handleCheckbox(!checked);
      }}
      className={`${quantico.className} w-full`}
    >
      <div className="flex flex-row justify-between w-full">
        {checked ? <span>Unblock</span> : <span>Block</span>}
      </div>
    </MenuItem>
  );
}
