import { BadRequestException, Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { connected } from 'process';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  async login(@Query() query, @Res() res: Response) {
    const code = query.code;

    if (!code) {
      throw new BadRequestException('expected code');
    }
    else {
      return await this.authService.login(code, res);
    }
  }
}



// get the code
//  error handling
// get the token (post method)
//  error handling
// get the user
// check if the user is in the database
// if not, create the user
//

//   @Post('login')
//   async login(@Body() body: { username: string; password: string }) {
//     return this.authService.login(body);
//   }
// }
