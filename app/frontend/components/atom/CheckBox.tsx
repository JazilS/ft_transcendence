import { MenuItem } from "@mui/material";
import { quantico } from "@/models/Font/FontModel";
import { mySocket } from "@/app/utils/getSocket";
import { useAppSelector } from "@/app/store/hooks";
import { useState } from "react";
// import '../style/Checkbox.css'

export default function CheckBoxMenuItem({
  value,
  userId,
  targetId,
  isBlocked,
}: {
  value: string;
  userId: string;
  targetId: string;
  isBlocked: boolean;
}) {
  const [checked, setChecked] = useState<boolean>(isBlocked);

  const handleCheckbox = () => {
    setChecked(checked);
    console.log("check value = ", checked);
    if (userId !== "" && value === "block") {
      mySocket.emit("BLOCK_USER", {
        blockerId: userId,
        blockedUserId: targetId,
        value: checked,
      });
    }
  };

  return (
    <MenuItem onClick={handleCheckbox} className={`${quantico.className}`}>
      <div className="flex flex-row justify-between w-full">
        <div>
          <span>{value}</span>
        </div>
        <div>
          <input type="checkbox" checked={checked} onChange={() => {}} />
        </div>
      </div>
    </MenuItem>
  );
}
