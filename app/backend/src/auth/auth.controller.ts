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
  async login(@Query() query, @Res() res: Response) {
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
    //delete the cookie -> in the front ?
  }

  // @UseGuards(AuthGuard)
  // @Get('test')
  // async test(context: ExecutionContext) {
  //   const request: Express.Request = context.switchToHttp().getRequest();

  //   if (context) {
  //     let req = context.getArgByIndex(1);
  //   }
  //   // console.log(request.user);
  //   // return await this.authService.logout(req);
  //     //delete the cookie
  // }
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
