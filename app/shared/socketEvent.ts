export const PONG_ROOM_PREFIX = 'pong_';
const pong = 'pong';

export enum PongEvent {
  ARROW_UP = `ArrowUp`,
  ARROW_DOWN = `ArrowDown`,
  NEW_PLAYER = `${pong}.new.player`,
  PADDLE_UP = `${pong}.up`,
  PADDLE_DOWN = `${pong}.down`,
  JOIN_QUEUE = `${pong}.join.queue`,
  LEAVE_QUEUE = `${pong}.leave.queue`,
  LETS_PLAY = `${pong}.lets.play`,
  REFRESHING_AND_LEAVE_QUEUE = `${pong}.refresh.leave.queue`,
  UPDATE_GAME = `${pong}.update.game`,
  USER_NO_MORE_IN_GAME = `${pong}.user.no.more.in.game`,
  SEND_GAME_INVITATION = `${pong}.send.game.invitation`,
  RECEIVE_GAME_INVITATION = `${pong}.receive.game.invitation`,
  ACCEPT_GAME_INVITATION = `${pong}.accept.game.invitation`,
  DECLINE_GAME_INVITATION = `${pong}.decline.game.invitation`,
  USER_DECLINED_INVITATION = `${pong}.user.declined.invitation`,
  UPDATE_PLAYER_POSITION = `${pong}.update.paddle.position`,
  USER_STOP_UPDATE = `${pong}.user.stop.update`,
  END_GAME = `${pong}.end.game`,
  JOIN_BACK_CURRENT_GAME = `${pong}.join.current.game`,
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
