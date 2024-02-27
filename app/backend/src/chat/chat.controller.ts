import { Controller, Param, Post } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Post('/:id')
  async getChat(@Param('id') id: string) {
	
  }
}
