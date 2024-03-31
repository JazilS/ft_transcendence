import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  async login(@Query() query: any, @Res() res: Response) {
    const code = query.code;

    if (!code) {
      throw new BadRequestException('expected code');
    } else {
      return await this.authService.login(code, res);
    }
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    return await this.authService.logout(req);
  }
}
