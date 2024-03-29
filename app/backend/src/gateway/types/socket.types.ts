import { Socket } from 'socket.io';

export type SocketWithAuth = Socket & { userId: string };

export type SocketServerResponse = {
  message: string;
  data: unknown;
  chatroomId?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
};
