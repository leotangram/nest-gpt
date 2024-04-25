import { IsString } from 'class-validator';

export class ProsConsDiscussionDTO {
  @IsString()
  readonly prompt: string;
}
