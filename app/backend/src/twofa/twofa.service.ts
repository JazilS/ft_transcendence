import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwofaService {
  constructor(private readonly prismaService: PrismaService) {}

  async setupTwoFa(UserId: string) {
    // console.log(UserId);
    const secret = speakeasy.generateSecret();
    console.log(secret);
    const qrCodeImage = await qrcode.toDataURL(secret.otpauth_url);
    await this.prismaService.user.update({
      where: { id: UserId },
      data: { twoFaSecret: secret.base32.toString() },
      // twoFa: true }
      // twoFa: true } faut pas le faire
    });
    return { secret: secret.base32, qrCode: qrCodeImage };
  }

  async validateTwoFa(UserId: string, code: string) {
    console.log('code: ', code);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: UserId,
      },
    });
    const verified = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: 'base32',
      token: code,
    });
    if (verified) {
      await this.prismaService.user.update({
        where: { id: UserId },
        data: { twoFa: true,
                qrCheck: false },
      });
    } else console.log('Wrong Code entered');
    console.log(verified);
    return verified;
  }

  async disableTwoFa(UserId: string) {
    const user = await this.prismaService.user.update({
      where: {
        id: UserId,
      },
      data: {
        twoFa: false,
        twoFaSecret: null,
        qrCheck: false,
      },
    });
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');
    void user;
  }


  async isActive(UserId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: UserId,
      },
    });
    if (!user)
      return false;
    return user.twoFa;
  }
  // async turnOnTwoFactorAuthenticaton(userId: string) {
  //     await this.prismaService.user.update({
  //         where: { id: userId },
  //         data: { twoFa: true }
  //     })
  // }
}
