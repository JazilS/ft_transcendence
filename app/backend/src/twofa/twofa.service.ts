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
            data: { twoFaSecret: secret.base32.toString(),
                    twoFa: true }
        });
        return { secret: secret.base32, qrCode: qrCodeImage }
    }

    async validateTwoFa(UserId: string, code: string) {
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
        console.log(verified);
    }

    async disableTwoFa(UserId: string) {
        const user = await this.prismaService.user.update({
            where: {
                id: UserId,
            },
            data: {
                twoFa: false,
                twoFaSecret: null,
            }
        });
    }
    // async turnOnTwoFactorAuthenticaton(userId: string) {
    //     await this.prismaService.user.update({
    //         where: { id: userId },
    //         data: { twoFa: true }
    //     })
    // }
}
