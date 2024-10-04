import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcAuthGuard } from 'src/contexts/shared/guards/rpc-auth.guard';
import { NatsPayloadInterface } from 'src/contexts/shared/nats/interfaces';
import { SendChatLineControllerDto } from './send-chat-line-controller.dto';
import { SendChatLineUseCase } from 'src/contexts/chat/application/use-cases';

@Controller('chats')
export class SendChatLineController {
  constructor(private readonly sendChatLineUseCase: SendChatLineUseCase) {}

  @UseGuards(RpcAuthGuard)
  @MessagePattern({ cmd: 'chats.send-chat-line' })
  run(@Payload() payload: NatsPayloadInterface<SendChatLineControllerDto>) {
    const { data, ...config } = payload;
    const { chatId, message } = data;
    return this.sendChatLineUseCase.run({ chatId, message }, config);
  }
}
