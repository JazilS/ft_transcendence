export type UserInfo = {
  id: boolean;
  name: boolean;
  profile: boolean;
  status: boolean;
  pong: boolean;
};

export const userId: UserInfo = {
  id: true,
  name: false,
  profile: false,
  status: true,
  pong: true,
};

export const UserData: UserInfo = {
  id: true,
  name: true,
  profile: true,
  status: true,
  pong: true,
};
