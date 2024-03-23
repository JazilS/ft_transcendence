import { BadRequestException, HttpException, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService,
    private jwtService: JwtService) {}
    
    async login(code: string, @Res() res: Response) {
      const token = await this.getAccessToken(code);
      let user = await this.getUserInfo(token) as { name: any; email: any; avatar: any; id: any };
      console.log(user);
      if (! await this.prismaService.user.findFirst({ where: { email: user.email } })) {
        const newUser = await this.prismaService.user.create({
          data: {
            email: user.email,
            name: user.name,
            status: 'ONLINE',
            avatar: user.avatar,
          },
        });
        user = { ...newUser, id: newUser.id };
      }
      else {
        const tmp = await this.prismaService.user.update({
          where: { email: user.email },
          data: { status : 'ONLINE'}
        });
        user = { ...tmp, id: tmp.id };
      }
      const payload = { sub: user.name, id: user.id };
      const jwt = this.jwtService.sign(payload);
      res.cookie("accessToken", jwt);
      return res.json({ access_token: jwt });
    }

    async logout(@Req() req: Request) {
      try {
        const token = this.extractTokenFromHeader(req);
        if (!token)
           throw new BadRequestException('authorization header not found');
        const decoded = this.jwtService.decode(token);
        if (!decoded)
          throw new BadRequestException('invalid token');
        console.log(decoded);
        await this.prismaService.user.update({
          where: { id: decoded.id },
          data: { status : 'OFFLINE'}
        });
      }
      catch (error) {
        return { error: error.message };
      }
    }
    
  async getAccessToken(code: string) : Promise<string> {
    const url = process.env.AUTH_URL_42_TOKEN;
    const data = {
      grant_type: 'authorization_code',
      client_id: process.env.UID,
      client_secret: process.env.SECRET,
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
    };
    console.log(url);
    console.log(data);
    try {
      const response = await axios.post(url, data);
      console.log(response.data);
      return response.data.access_token;
    }
    catch (error) {
      throw new HttpException('Failed to get access token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserInfo(token: string) {
    const url = process.env.AUTH_URL_42_USER;
    console.log(url);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      console.log(headers);
      const userInfo = await axios.get(url, { headers });
      // console.log(userInfo.data.login);
      return {
        name: userInfo.data.login,
        email: userInfo.data.email,
        avatar: userInfo.data.image.versions.medium, //check var names on /v2/me
      }
    }
    catch (error) {
      throw new HttpException('Failed to get user info', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}


  // async register(body: { username: string; password: string }) {
  //   const user = await this.prismaService.user.create({
  //     data: {
  //       email: body.username,
  //     },
  //   });

  //   return { data: user, status: 201 };
  // }

