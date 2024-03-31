import {
  IsString,
  IsOptional,
  IsObject,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';

// CreateChatRoomDto
export class CreateChatRoomDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'Only alphanumeric characters are allowed',
  })
  name: string;

  @IsString()
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(15)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'Only alphanumeric characters are allowed',
  })
  password?: string;

  @IsString()
  creatorId: string;
}

// JoinChatRoomDto
export class JoinChatRoomDto {
  @IsString()
  channelId: string;

  @IsString()
  @IsOptional()
  password?: string;
}

// GetChatRoomByIdDto
export class GetChatRoomByIdDto {
  @IsString()
  channelId: string;
}

// GetUserNamesFromRoomDto
export class GetUserNamesFromRoomDto {
  @IsString()
  channelId: string;
}

// GetMessagesFromRoomDto
export class GetMessagesFromRoomDto {
  @IsString()
  roomId: string;
}

// GetProfilesFromRoomDto
export class GetProfilesFromRoomDto {
  @IsString()
  channelId: string;

  @IsString()
  userId: string;
}
