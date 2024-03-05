"use client";

import { press_Start_2P, quantico } from "@/models/Font/FontModel";
import Link from "next/link";
import "../../style/page.css";
import { Provider } from "react-redux";
import { setAllData } from "../store/features/User/UserSlice";
import { useAppDispatch } from "../store/hooks";
import { store } from "../store/store";
import { useRegisterMutation } from "../store/features/User/user.api.slice";

function LogPage() {
  const dispatch = useAppDispatch();
  const [register] = useRegisterMutation();

  const handleNewUser = async () => {
    const response = await register();

    if ('error' in response) {
      // Handle error here
      console.error(response.error);
    } else {
      dispatch(setAllData(response.data));
      console.log(response.data);
    }
  };

  return (
    <div className="flex flex-col items-center justify-evenly">
      {/* <MyHeader display={false} /> */}
      <div className={` text-black text-7xl ${press_Start_2P.className}`}>
        PONG
      </div>
      <Link href="/home">
        <button
          className={`text-white text-xl bg-gradient-to-r from-fuchsia-900 to-indigo-900  rounded-lg p-1 pl-14 pr-14  ${quantico.className}`}
          onClick={handleNewUser}
        >
          Login with 42
        </button>
      </Link>
    </div>
  );
}

export default function LogPageLayout() {
  return (
    <Provider store={store}>
      <div className="flex flex-col h-[100vh] bg-gradient-to-r from-indigo-500 to-fuchsia-500">
        <div className="bg-black h-[8vh] flex items-center ">
          <span
            className={`items-center bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-transparent text-2xl pl-48 ${press_Start_2P.className}`}
          >
            FT_TRANSCENDENCE
          </span>
        </div>
        <div className="h-[100%] flex pb-20 justify-evenly">
          <LogPage></LogPage>
        </div>
      </div>
    </Provider>
  );
}
