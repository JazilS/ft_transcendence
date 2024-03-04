import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserData, UserInfo } from '../types/userInfo';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserInfo(userId: string, id: string) {
    const [me, user] = await Promise.all([
      this.finUserById(userId, UserData),
      this.prismaService.user.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          nickname: true,
          status: true,
          pong: {
            select: {
              victory: true,
              losses: true,
              rating: true,
            },
          },
        },
      }),
    ]);

    if (!me || !user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(nickname: string, profile: Profile, select: UserInfo) {}

  public async finUserById(id: string, select: UserInfo) {
    return this.prismaService.user.findUnique({
      where: { id },
      select,
    });
  }

  public async findUserByNickname(nickname: string, select: UserInfo) {
    return this.prismaService.user.findUnique({
      where: { nickname },
      select,
    });
  }
}
