import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcAuthGuard } from 'src/contexts/shared/guards/rpc-auth.guard';
import { NatsPayloadInterface } from 'src/contexts/shared/nats/interfaces';
import { GetChatUseCase } from 'src/contexts/chat/application/use-cases';
import { GetChatControllerDto } from './get-chat-controller.dto';

@Controller('chats')
export class GetChatController {
  constructor(private readonly getChatUseCase: GetChatUseCase) {}

  @UseGuards(RpcAuthGuard)
  @MessagePattern({ cmd: 'chats.get-chat' })
  run(@Payload() payload: NatsPayloadInterface<GetChatControllerDto>) {
    const { data, ...config } = payload;
    const { targetProfileId } = data;
    return this.getChatUseCase.run({ targetProfileId }, config);
  }
}
