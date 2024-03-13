import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  // REGISTER
  async register() {
    try {
      // Créer les utilisateurs
      const user1 = await this.prismaService.user.create({
        data: {
          name: 'Musashi',
          avatar: '/Musashi.jpg',
        },
      });
      return {
        playerProfile: {
          id: user1.id,
          name: user1.name,
          imageSrc: user1.avatar,
          games: [],
        },
        channelsIn: [],
        isConnected: false,
        isReadyLobby: false,
        access_token: '',
      };
    } catch (error) {
      console.log(error);
      return 'Error Register!';
    }
  }

  // UPDATEUSERNAME
  async updateUsername(body: { userId: string; newName: string }) {
    try {
      console.log('userId', body.userId);
      await this.prismaService.user.update({
        where: { id: body.userId },
        data: { name: body.newName },
      });
      console.log(
        (
          await this.prismaService.user.findUnique({
            where: { id: body.userId },
          })
        ).name,
      );
      return 'Username updated';
    } catch (error) {
      console.log(error);
      return 'Error !';
    }
  }

  // UPDATEAVATAR
  async updateAvatar(body: { userId: string; newAvatar: string }) {
    try {
      await this.prismaService.user.update({
        where: { id: body.userId },
        data: { avatar: body.newAvatar },
      });
      return 'Avatar updated';
    } catch (error) {
      console.log(error);
      return 'Error !';
    }
  }

  // GETUSERNAMEBYID
  async getUserNameById(body: { userId: string }) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: body.userId },
      });
      return { name: user.name };
    } catch (error) {
      console.log(error);
      return 'Error getting username by id !';
    }
  }

  // GETPROFILEBYID
  async getProfileById(userId: string) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      return {
        id: user.id,
        name: user.name,
        imageSrc: user.avatar,
        games: [], //! A CHANGER POUR PROFILE (recuperer les games du user)
      };
    } catch (error) {
      console.log(error);
      return 'Error getting profile by id !';
    }
  }
}
