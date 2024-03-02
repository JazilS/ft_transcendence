import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  constructor(
	private readonly prismaService: PrismaService,
	
  ) {}

  getGamebyIdAndReturnIndex(gameId: string) 
  {	

  }
