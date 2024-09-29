import { IsNotEmpty } from 'class-validator';

export class CreateChatControllerDto {
  @IsNotEmpty()
  public profilesIds: string[];
}
