export type Profile = {
  avatar?: string;
  firstname?: string;
  lastname?: string;
};

export type UserInfo = {
  id: boolean;
  name: boolean;
  email: boolean;
  password: boolean;
  createdAt: boolean;
  status: boolean;
  updatedAt: boolean;
  firstConnection: boolean;
  hashedRefreshToken: boolean;
  twoFa: boolean;
  pong: boolean;
  profile: boolean;
  blockedUsers: boolean;
  blockedBy: boolean;
  friends: boolean;
  allowForeignToDm: boolean;
  friendRequestsReceived: boolean;
  friendRequestsSent: boolean;
  chatrooms: boolean;
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
export const UserData: UserInfo = {
  id: true,
  name: true,
  firstConnection: true,
  email: true,
  password: true,
  createdAt: true,
  status: true,
  updatedAt: true,
  allowForeignToDm: true,
  hashedRefreshToken: false,
  twoFa: true,
  pong: true,
  profile: true,
  blockedUsers: false,
  blockedBy: false,
  friends: false,
  friendRequestsReceived: false,
  friendRequestsSent: false,
  chatrooms: false,
  messages: false,
  restrictedGroups: false,
};
