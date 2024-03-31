import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(code: string, @Res() res: Response) {
    const token = await this.getAccessToken(code);
    let incomingUser = (await this.getUserInfo(token)) as {
      name: any;
      email: any;
      avatar: any;
      id: any;
    };
    console.log(incomingUser);
    const registeredUser = await this.prismaService.user.findUnique({
      where: { email: incomingUser.email },
    });
    if (!registeredUser) {
      const newUser = await this.prismaService.user.create({
        data: {
          email: incomingUser.email,
          name: incomingUser.name,
          status: 'ONLINE',
          avatar: incomingUser.avatar,
        },
      });
      incomingUser = { ...newUser, id: newUser.id };
    } else {
      if (registeredUser.twoFa && registeredUser.qrCheck) {
        const payload = {
          sub: registeredUser.name,
          id: registeredUser.id,
          avatar: registeredUser.avatar,
        };
        const jwt = this.jwtService.sign(payload);
        res.cookie('2fa', jwt);
        res.redirect('http://localhost:3000/twofa');
        return registeredUser.id;
      } else {
        const tmp = await this.prismaService.user.update({
          where: { email: incomingUser.email },
          // where: { id: user.id },
          data: { status: 'ONLINE' },
        });
        incomingUser = { ...tmp, id: tmp.id };
      }
    }
    const payload = {
      sub: incomingUser.name,
      id: incomingUser.id,
<<<<<<< HEAD
      avatar: incomingUser.avatar,
=======
      // avatar: incomingUser.avatar,
>>>>>>> origin/kenan_2
    };
    const jwt = this.jwtService.sign(payload);
    res.cookie('accessToken', jwt);
    // res.cookie('avatar', incomingUser.avatar);
    res.cookie('name', incomingUser.name);
    res.redirect('http://localhost:3000/home');
    return { access_token: jwt };
  }

  async logout(@Req() req: Request) {
    try {
      const token = this.extractTokenFromHeader(req);
      if (!token)
        throw new BadRequestException('authorization header not found');
      const decoded = this.jwtService.decode(token);
      if (!decoded) throw new BadRequestException('invalid token');
      console.log(decoded);
      const user = await this.prismaService.user.findUnique({
        where: { id: decoded.id },
      });
      await this.prismaService.user.update({
        where: { id: decoded.id },
        data: { status: 'OFFLINE', qrCheck: user.twoFa ? true : false }, //! qrCode
      });
      return { data: 'logout successful' };
    } catch (error) {
      return { error: error.message };
    }
  }

  async getAccessToken(code: string): Promise<string> {
    const url = process.env.AUTH_URL_42_TOKEN;
    const data = {
      grant_type: 'authorization_code',
      client_id: process.env.UID,
      client_secret: process.env.SECRET,
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
    };
    // console.log(url);
    // console.log(data);
    try {
      const response = await axios.post(url, data);
      // console.log(response.data);
      return response.data.access_token;
    } catch (error) {
      throw new HttpException(
        'Failed to get access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserInfo(token: string) {
    const url = process.env.AUTH_URL_42_USER;
    // console.log(url);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      // console.log(headers);
      const userInfo = await axios.get(url, { headers });
      console.log(userInfo.data.login);
      return {
        name: userInfo.data.login,
        email: userInfo.data.email,
        avatar: userInfo.data.image.versions.small, //check var names on /v2/me
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get user info',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
