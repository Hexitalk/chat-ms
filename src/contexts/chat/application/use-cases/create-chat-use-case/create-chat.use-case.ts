import { Injectable } from 'src/contexts/shared/dependency-injection/injectable';

import { ClientProxy, RpcException } from '@nestjs/microservices';

import {
  NatsPayloadConfigInterface,
  // NatsPayloadInterface,
} from 'src/contexts/shared/nats/interfaces';
import { NatsPayloadConfig } from 'src/contexts/shared/decorators';
import { NATS_SERVICE } from 'src/config';
import { Inject } from '@nestjs/common';
import { ChatRepository } from 'src/contexts/chat/domain/ports/chat.repository';
import { CreateChatDto } from './create-chat.dto';
import {
  ChatModel,
  ChatModelInterface,
} from 'src/contexts/chat/domain/models/chat.model';
// import { firstValueFrom } from 'rxjs';

@Injectable()
export class CreateChatUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async run(
    dto: CreateChatDto,
    @NatsPayloadConfig() config?: NatsPayloadConfigInterface,
  ): Promise<{ chat: ChatModelInterface }> {
    const chatModel = ChatModel.create(dto);
    let responseChat: ChatModelInterface;

    try {
      const resQuery = await this.chatRepository.insert(chatModel);
      responseChat = resQuery.toInterface();
    } catch (error) {
      // if (error instanceof FailSaveDatabaseException) {
      //   throw new FailCreateUserRpcException();
      // }
      throw new RpcException('error');
    }

    return {
      chat: responseChat,
    };
  }
}
