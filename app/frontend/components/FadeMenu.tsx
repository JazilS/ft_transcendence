import * as React from "react";
import Button from "./Button";
import CheckBoxMenuItem from "./CheckBox";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { quantico } from "@/models/FontModel";
import "../style/FadeMenu.css"

export default function FadeMenu({ value }: { value: string }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        className="hover:bg-[#f28eff] pl-9 "
        variant={"channel"}
        size={"channel"}
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {value}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transitionDuration={150}
        TransitionComponent={Fade}
        className="optionmembres ml-4"
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Add Friend</MenuItem>
        <MenuItem onClick={handleClose}>Send message</MenuItem>
        <MenuItem onClick={handleClose}>Invite in game</MenuItem>
      
      {/* le useState n'est pas bien gere pour le checkbox, Corriger ca quand on urilise les vraies donnees du back */}
        <CheckBoxMenuItem value='block'></CheckBoxMenuItem>
        <CheckBoxMenuItem value="mute"></CheckBoxMenuItem>
        

        {/* seulement si ils ne sont pas amis */}

        {/* ajouter ces options pour les operateurs */}
        <MenuItem>Kick from channel</MenuItem>
        <MenuItem>Ban from channel</MenuItem>

        {/* seulement si l'utilisateur n'est pas deja promu */}
        <MenuItem onClick={handleClose}>Promote in channel</MenuItem>
      </Menu>
    </div>
  );
}


// import React, { useState } from 'react';

// function App() {
 

//   return (
//     <div>

//     </div>
//   );
// }

// export default App;