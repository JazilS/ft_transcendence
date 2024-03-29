export type UserInfo = {
  id: boolean;
  nickname: boolean;
  profile: boolean;
  status: boolean;
  pong: boolean;
};

export const userId: UserInfo = {
  id: true,
  nickname: false,
  profile: false,
  status: true,
  pong: true,
};

export const UserData: UserInfo = {
  id: true,
  nickname: true,
  profile: true,
  status: true,
  pong: true,
};
