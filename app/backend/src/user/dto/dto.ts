import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class UserIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateUsernameDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9_.]*$/, {
    message: 'must contain only letters, numbers, and underscores',
  })
  newName: string;
}

export class GetProfileByNameDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9_.]*$/, {
    message: 'must contain only letters, numbers, and underscores',
  })
  userName: string;
}
