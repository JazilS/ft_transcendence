"use client";

import React from "react";
import Image from "next/image";
import "../styles.css";
import "../../style/FadeMenu.css";
import { Provider } from "react-redux";
import { store } from "../store/store";

export default function HomePage() {
  return <Provider store={store}>{<GameImage />}</Provider>;
}

const GameImage: React.FC = () => {
  //   const dispatch = useAppDispatch();
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       console.log("useEffect called");
  //       await axios
  //         .get("http://localhost:4000/api/user/getUser", {
  //           headers: {
  //             Authorization: `Bearer ${Cookies.get("accessToken")}`,
  //           },
  //           withCredentials: true,
  //         })
  //         .then((response: { data: { qrCode: string } }) => {
  //           console.log("jai recu la reponse", response.data.qrCode);
  //         })
  //         .catch((error: any) => {
  //           console.error("Error fetching QR code URL:", error);
  //         });
  //     };

  //     const accessToken = Cookies.get("accessToken");
  //     if (accessToken != undefined) {
  //       const decoded = jwtDecode(accessToken);
  // 	  console.log(decoded);
  //     }

  //     fetchData();
  //   }, [dispatch]);

  return (
    <div className=" flex flex-col justify-center items-center rounded-3xl h-[90vh] ">
      <div>
        <Image
          src="/Pong.jpg"
          alt="Pong"
          width={565}
          height={353}
          className="rounded-3xl drop-shadow-2xl"
        />
      </div>
    </div>
  );
};
