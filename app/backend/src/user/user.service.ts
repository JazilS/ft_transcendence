import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserData, UserInfo } from '../types/userInfo';
import { Profile } from './types/userTypes';
import { User } from '@prisma/client';

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

  async createUser(nickname: string, profile: Profile, select: UserInfo) {
    return await this.prismaService.user.create({
      data: {
        nickname,
        profile: {
          create: profile,
        },
        pong: {
          create: {},
        },
      },
      select,
    });
  }

  async findUserById(id: string, select: UserInfo) {
    return this.prismaService.user.findUnique({
      where: { id },
      select,
    });
  }

  async findUserByNickname(nickname: string, select: UserInfo) {
    return this.prismaService.user.findUnique({
      where: { nickname },
      select,
    });
  }

  async findManyUsers(ids: string[], select: UserInfo) {
    return this.prismaService.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select,
    });
  }

  async UpdateUserById(id: string, data: Partial<User>) {
    return this.prismaService.user.update({
      where: { id },
      data,
      include: {
        profile: {
          select: {
            lastname: true,
            firstname: true,
            avatar: true,
          },
        },
      },
    });
  }
}
