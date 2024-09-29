import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcAuthGuard } from 'src/contexts/shared/guards/rpc-auth.guard';
import { NatsPayloadInterface } from 'src/contexts/shared/nats/interfaces';
import { CreateChatUseCase } from 'src/contexts/chat/application/use-cases';
import { CreateChatControllerDto } from './create-chat-controller.dto';

@Controller('chats')
export class CreateHubController {
  constructor(private readonly createHubUseCase: CreateChatUseCase) {}

  @UseGuards(RpcAuthGuard)
  @MessagePattern({ cmd: 'chat.create-chat' })
  run(@Payload() payload: NatsPayloadInterface<CreateChatControllerDto>) {
    const { data, ...config } = payload;
    const { profilesIds } = data;
    return this.createHubUseCase.run({ profilesIds }, config);
  }
}
