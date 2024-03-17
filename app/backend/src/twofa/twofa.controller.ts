import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TwofaService } from 'src/twofa/twofa.service';
import { GetUser } from 'src/decorator/get.user.decorator';

@Controller('twofa')
export class TwofaController {
    constructor(private readonly TwofaService: TwofaService) {}

    @UseGuards(AuthGuard)
    @Get('setup')
    async setup(@GetUser('id') UserId: string) {
        return await this.TwofaService.setupTwoFa(UserId);
    }

}
