import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { connected } from 'process';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('login')
  async login(@Query() query) {
    const code = query.code;

    if (!code) {
      throw new BadRequestException('expected code');
    }
    else {
      await this.authService.login(code);
    }
  }
}

// get the code
// error
// get the token (post method)
// error
// get the user
// check if the user is in the database
// if not, create the user
//

//   @Post('login')
//   async login(@Body() body: { username: string; password: string }) {
//     return this.authService.login(body);
//   }
// }
