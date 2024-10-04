import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendChatLineControllerDto {
  @IsNotEmpty()
  @IsString()
  public chatId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  public message: string;
}
