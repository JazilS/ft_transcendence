import { useGetUserIdByNameMutation } from "@/app/store/features/User/user.api.slice";
import { press_Start_2P } from "@/models/Font/FontModel";
import { useEffect, useState } from "react";
import { set } from "zod";
import PublicProfile from "./PublicProfile";

export default function SearchBar() {
  const [userName, setUserName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [open, setOpen] = useState<boolean>(false);

  // useEffect(() => {
  //   console.log("userId:", userId);
  // }, [userId]);

  return (
    <form className="w-[55%] ml-32">
      <div className={`${press_Start_2P.className}`}>
        <input
          type="search"
          placeholder="search"
          value={userName}
          className="h-[44px] p-4 rounded-lg  bg-white placeholder-indigo-500 text-black text-center text-xl"
          onChange={(e) => setUserName(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setOpen(true);
              setSearchName(userName);
              setUserName("");
            }
          }}
        />
      </div>
      {searchName !== "" && searchName && (
        <PublicProfile targetName={searchName} open={open} setOpen={setOpen} />
      )}
    </form>
  );
}
