import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async login(code: string) {
    const token = await this.getAcessToken(code);
    const user = await this.getUserInfo(token);
    console.log(user);
    if (this.prismaService.user.findFirst({ where: { email: user.email } }))
        return user; //jwt
    else {
      const newUser = await this.prismaService.user.create({
        data: {
          email: user.email,
          nickname: user.name,
          status: 'ONLINE',
          avatar: user.pfp,
        },
      });
      return newUser;
    }
    return user;
  }

  async getAcessToken(code: string) : Promise<string> {
    const url = process.env.AUTH_URL_42_TOKEN;
    console.log(url);
    const data = {
      grant_type: 'authorization_code',
      client_id: process.env.UID,
      client_secret: process.env.SECRET,
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
    };
    try {
      const response = await axios.post(url, data);
      console.log(response.data);
      return response.data.access_token;
    }
    catch (error) {
      //;
    }
  }

  async getUserInfo(token: string) {
    const url = process.env.AUTH_URL_42_USER;
    console.log(url);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const userInfo = await axios.get(url, { headers });
      console.log(userInfo.data.image.versions.medium);
      return {
        name: userInfo.data.login,
        email: userInfo.data.email,
        pfp: userInfo.data.image.versions.medium, //check var names on /v2/me
      }
    }
    catch (error) {
      //;
    }
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

