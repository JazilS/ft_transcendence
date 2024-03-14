import * as React from "react";
import Button from "../../../atom/Button";
import CheckBoxMenuItem from "../../../atom/CheckBox";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import "@/style/FadeMenu.css";
import { quantico } from "@/models/FontModel";

export default function FadeMenu({ userName }: { userName: string }) {
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
        variant={"publicChannel"}
        size={"channel"}
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {userName}
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
        className={`optionmembres ml-4`}
      >
        {/* <MenuItem onClick={handleClose}>
          Profile
        </MenuItem> */}
        {/* seulement si ils ne sont pas amis */}
        {/* <MenuItem onClick={handleClose}>Add Friend</MenuItem>
        <MenuItem onClick={handleClose}>Send message</MenuItem>
        <MenuItem onClick={handleClose}>Invite in game</MenuItem> */}

        {/* le useState n'est pas bien gere pour le checkbox, Corriger ca quand on urilise les vraies donnees du back */}
        <CheckBoxMenuItem
          value="block"
          blockeduserName={userName}
        ></CheckBoxMenuItem>

        {/* <CheckBoxMenuItem value="mute"></CheckBoxMenuItem> */}

        {/* ajouter ces options pour les operateurs */}
        {/* <MenuItem>Kick from channel</MenuItem>
        <MenuItem>Ban from channel</MenuItem> */}
        {/* seulement si l'utilisateur n'est pas deja promu */}
        {/* <MenuItem onClick={handleClose}>Promote in channel</MenuItem> */}
      </Menu>
    </div>
  );
}

/**
 * TODO : differentes possibilites de menu
 * !    Group Room ->
 * * 1. Version membre non operateur : Profile, Add Friend, Send message, Invite in game, block
 * * 2. Version operateur : ... + mute, kick, ban, promote
 * *    - un operateur non createur du channel ne peux pas agir sur le createur
 * * 3. Si l'utilisateur clique sur son propre nom, rien ne se passe
 
 * !    Private Room ->
 * * 1. seulement les options suivantes : Profile, Invite in game, block
 * * 2. Si l'utilisateur clique sur son propre nom, rien ne se passe
 */

// import React, { useState } from 'react';

// function App() {

//   return (
//     <div>

//     </div>
//   );
// }

// export default App;
