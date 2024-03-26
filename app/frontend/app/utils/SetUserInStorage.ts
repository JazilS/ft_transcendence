// import User from "@/models/User/UserModel";
// import { useAppDispatch, useAppSelector } from "../store/hooks";
// import Cookies from "js-cookie";
// import { jwtDecode, JwtPayload } from "jwt-decode";
// import { setUserProfile } from "../store/features/User/UserSlice";
// import { RootState } from "../store/store";
// import { useEffect } from "react";

// export function SetUserInStorage() {
//   const dispatch = useAppDispatch();

//   const user: User = useAppSelector((state: RootState) => state.user.user);
//   if (user !== undefined) return null;
//   let decoded: JwtPayload | undefined;
//   const accessToken = Cookies.get("accessToken");
//   if (accessToken != undefined) {
//     decoded = jwtDecode(accessToken);
//     if (decoded !== undefined) {
//       dispatch(
//         setUserProfile({
//           id: decoded.id,
//           name: decoded.sub as string,
//           avatar: decoded.avatar,
//         })
//       );
//       console.log(decoded);
//     }
//   }
//   return null;
// }
