import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserInfo(userId: string, id: string) {
    const [me, user] = await Promise.all([
      this.finUserById(userId),
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
              defeat: true,
              classment: true,
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

  public async finUserById(id: string) {
    return this.prismaService.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        nickname: true,
        pong: {
          select: {
            victory: true,
            defeat: true,
            classment: true,
          },
        },
      },
    });
  }
}
