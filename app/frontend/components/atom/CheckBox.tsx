import { MenuItem } from "@mui/material";
import * as React from "react";
import { quantico } from "@/models/FontModel";
// import '../style/Checkbox.css'

export default function CheckBoxMenuItem({ value }:{ value: string}) 
{
	const [checked, setChecked] = React.useState(false);

	const handleCheckbox = () => {
	  setChecked(!checked);
	};
  
	return (
		<MenuItem onClick={handleCheckbox} className={`${quantico.className}`}>
			<div className="flex flex-row justify-between w-full">
				<div>
					<span>{value}</span>
				</div>
				<div>
					<input type="checkbox" checked={checked}/>
				</div>
			</div>
		</MenuItem>
	);
};
