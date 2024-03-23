export type Profile = {
  avatar?: string;
  firstname?: string;
  lastname?: string;
};

export type UserInfo = {
  id: boolean;
  email: boolean;
  avatar: boolean;
  status: boolean;
  name: boolean;
  twoFa: boolean;
  twoFaSecret: boolean;
  friends: boolean;
  friendsRelation: boolean;
 
  //remove ?
  password: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  firstConnection: boolean;
  hashedRefreshToken: boolean;
  pong: boolean;
  profile: boolean;
  blockedUsers: boolean;
  blockedBy: boolean;
  friendRequestsReceived: boolean;
  friendRequestsSent: boolean;
  chatrooms: boolean;
  allowForeignToDm: true,
  messages: boolean;
  restrictedGroups: boolean;
};

// export const UserData: UserInfo = {
//   id: true,
//   name: true,
//   firstConnection: true,
//   email: true,
//   password: true,
//   createdAt: true,
//   status: true,
//   updatedAt: true,
//   allowForeignToDm: true,
//   hashedRefreshToken: false,
//   twoFa: true,
//   pong: true,
//   profile: true,
//   blockedUsers: false,
//   blockedBy: false,
//   friends: false,
//   friendRequestsReceived: false,
//   friendRequestsSent: false,
//   chatrooms: false,
//   messages: false,
//   restrictedGroups: false,
// };
