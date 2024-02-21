// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';

// @WebSocketGateway(8001, { cors: '*' })
// export class ChatGateway {
//   @WebSocketServer()
//   server;
//   @SubscribeMessage('message')
//   handleMessage(@MessageBody() message: string): void {
//     console.log(message);
//     this.server.emit('message', message);
//   }
// }

import { Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from 'src/chat/chat.service';

@WebSocketGateway({
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit {
  private readonly logger = new Logger(ChatGateway.name);
  constructor(private readonly chatService: ChatService) {}

  afterInit(): void {
    this.logger.log('Websokcet Gateway Initialized');
  }
}
