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
        const qrCodeImage = await qrcode.toDataURL(secret.otpauthUrl);
        console.log(secret);
        await this.prismaService.user.update({
            where: { id: UserId },
            data: { twoFaSecret: secret.base32.toString(),
                    twoFa: true }
        });
        return { secret: secret.base32, qrCode: qrCodeImage}
    }

    async turnOnTwoFactorAuthenticaton(userId: string) {
        await this.prismaService.user.update({
            where: { id: userId },
            data: { twoFa: true }
        })
    }
}
