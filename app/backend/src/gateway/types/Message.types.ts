// import { IsNotEmpty } from 'class-validator';

// export class MessageDto {
//   @IsNotEmpty()
//   id: string;

//   @IsNotEmpty()
//   content: string;

//   @IsNotEmpty()
//   chatId: string;

//   @IsNotEmpty()
//   emitter: string;
// }

export default interface Messages {
  id: string;
  content: string;
  chatId: string;
  emitterId: string;
  emitterName: string;
  emitterAvatar: string;
}
