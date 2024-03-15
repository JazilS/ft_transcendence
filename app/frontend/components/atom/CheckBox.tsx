import { MenuItem } from "@mui/material";
import * as React from "react";
import { quantico } from "@/models/Font/FontModel";
import { mySocket } from "@/app/utils/getSocket";
import { useAppSelector } from "@/app/store/hooks";
// import '../style/Checkbox.css'

export default function CheckBoxMenuItem({
  value,
  targetId,
}: {
  value: string;
  targetId: string;
}) {
  const [checked, setChecked] = React.useState();


  async function fetchIsBlocked( targetId: string) {
    const response: boolean = await ;
    return response;
  }


  const handleCheckbox = () => {
    setChecked(checked);
    console.log(checked);
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
