import { MenuItem } from "@mui/material";
import * as React from "react";
import { quantico } from "@/models/Font/FontModel";
import { mySocket } from "@/app/utils/getSocket";
import { useAppSelector } from "@/app/store/hooks";
// import '../style/Checkbox.css'

export default function CheckBoxMenuItem({
  value,
  blockeduserName,
}: {
  value: string;
  blockeduserName: string;
}) {
  const [checked, setChecked] = React.useState(false);
  const userId = useAppSelector((state) => state.user.user.playerProfile.id);
  
// TODO: recuperer le id du user a bloquer  
  
  const handleCheckbox = () => {
    setChecked(!checked);
    mySocket.emit("BLOCK_USER", {
      blockerId: userId,
      blockedUserId: blockeduserId, // TODO: ICI
      value: checked,
    });
  };

  return (
    <MenuItem onClick={handleCheckbox} className={`${quantico.className}`}>
      <div className="flex flex-row justify-between w-full">
        <div>
          <span>{value}</span>
        </div>
        <div>
          <input type="checkbox" checked={checked} onChange={handleCheckbox} />
        </div>
      </div>
    </MenuItem>
  );
}
