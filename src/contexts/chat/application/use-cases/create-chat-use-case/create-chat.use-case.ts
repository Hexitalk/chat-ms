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
import { ChatProfileRepository } from 'src/contexts/chat/domain/ports/chat-profile.repository';
import { ChatProfileModel } from 'src/contexts/chat/domain/models/chat-profile.model';
// import { firstValueFrom } from 'rxjs';

@Injectable()
export class CreateChatUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatProfileRepository: ChatProfileRepository,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async run(
    dto: CreateChatDto,
    @NatsPayloadConfig() config?: NatsPayloadConfigInterface,
  ): Promise<{ chat: ChatModelInterface }> {
    const { profilesIds } = dto;

    if (!profilesIds.length) {
      throw new RpcException('error');
    }

    let responseChat: ChatModelInterface;

    const chatAttributes: Partial<ChatModelInterface> = {};

    const chatModel = ChatModel.create(chatAttributes);

    try {
      const resQuery = await this.chatRepository.insert(chatModel);
      responseChat = resQuery.toInterface();
    } catch (error) {
      // if (error instanceof FailSaveDatabaseException) {
      //   throw new FailCreateUserRpcException();
      // }
      throw new RpcException('error');
    }

    for (let i = 0; i < profilesIds.length; i++) {
      const profileId = profilesIds[i];
      const chatProfileModel = ChatProfileModel.create({
        chat_id: responseChat.id,
        profile_id: profileId,
      });

      try {
        const resQueryChatProfile =
          await this.chatProfileRepository.insert(chatProfileModel);
        const resChatProfile = resQueryChatProfile.toInterface();
        responseChat.chats_profiles.push(resChatProfile);
      } catch (error) {}
    }

    return {
      chat: responseChat,
    };
  }
}
