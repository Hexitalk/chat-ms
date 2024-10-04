import { IsNotEmpty } from 'class-validator';

export class GetChatControllerDto {
  @IsNotEmpty()
  public targetProfileId: string;
}
