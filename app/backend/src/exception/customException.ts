import { HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

type WsExceptionType = 'BadRequest' | 'Unauthorized' | 'Not Found' | 'Unknown';

export class WsTypeException extends WsException {
  readonly type: WsExceptionType;

  constructor(
    type: WsExceptionType,
    message: string | unknown,
    data?: { chatroomId: string },
  ) {
    const error = {
      type,
      message,
      data,
    };
    super(error);
    this.type = type;
  }
}

export class CustomException extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

export class WsUnknownException extends WsTypeException {
  constructor(message: string | unknown, data?: { chatroomId: string }) {
    super('Unknown', message, data);
  }
}
