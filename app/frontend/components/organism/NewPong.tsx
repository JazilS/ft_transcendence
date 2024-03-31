// import React, { useEffect } from "react";
// import {
//   ConnectSocket,
//   mySocket,
//   stopListeningToSocket,
// } from "@/app/utils/getSocket";
// import { PongEvent } from "@/shared/socketEvent";
// import { useNavigate } from "react-router-dom";
// import { useRouter } from 'next/router'
// import Link from "next/link";

// export default function NewPong() {
//   // const router = useRouter();
//   // const navigate = useNavigate();
//   const [stupid, setStupid] = React.useState(0);
//   useEffect(() => {
//     if (stupid == 1) {
//       // navigate("/ping:sdasdasdasdsadasdas");
//     }
//   }, [stupid]);
  
//   return (
//     <div>
//       <h1>New Pong</h1>
//       {/* <Link href={{ pathname: '/ping', query: { keyword: ';athis way' } }}><a>path</a></Link> */}
//       <button onClick={() => setStupid(stupid + 1)}>Click me</button>
//     </div>
//   );
// }
