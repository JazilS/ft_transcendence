export enum PongEvent {
  ARROW_UP = "ArrowUp",
  UPDATE_PLAYER_POSITION = "pong.update.paddle.position",
  ARROW_DOWN = "ArrowDown",
  USER_STOP_UPDATE = "pong.user.stop.update",
}

const General = 'general';

export enum GeneralEvent {
  EMIT_TO_MYSELF = `${General}.emit.to.myself`,
  BROADCAST = "broadcast",
  USER_UPDATE_STATUS = `${General}.user.update.status`,
  EXCEPTION = "exception",
  SUCCESS = `${General}.success`,
  JOIN = `${General}.join`,
  LEAVE = `${General}.leave`,
  NEW_PROFILE_PICTURE = `${General}.new.profile.pic`,
  USER_CHANGED_AVATAR = `${General}.new.avatar.pic`,
  UPDATE_USER_PROFILE = `${General}.update.user`,
  USER_CHANGED_USERNAME = `${General}.changed.username`,
  TOKEN_NOT_VALID = `${General}.token.not.valid`,
  DISCONNECT_ALL_INSTANCE_OF_ME = `${General}.disconnect.all.instance.of.me`,
  DISCONNECT_ME = `${General}.disconnect.me`,
  DISCONNECT_ALL_EXCEPT_ME = `${General}.disconnect.all.except.me`,
  DISCONNECT = "disconnect",
  NEW_BLOCKED_USER = `${General}.add.blocked.user`,
  REMOVE_BLOCKED_USER = `${General}.remove.blocked.user`,
  DESERTER = `${General}.deserter`,
}
