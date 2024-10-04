import { Injectable } from 'src/contexts/shared/dependency-injection/injectable';

import { ClientProxy, RpcException } from '@nestjs/microservices';

import {
  NatsPayloadConfigInterface,
  NatsPayloadInterface,
  // NatsPayloadInterface,
} from 'src/contexts/shared/nats/interfaces';
import { NatsPayloadConfig } from 'src/contexts/shared/decorators';
import { NATS_SERVICE } from 'src/config';
import { Inject } from '@nestjs/common';
import { ChatRepository } from 'src/contexts/chat/domain/ports/chat.repository';
import { ChatProfileRepository } from 'src/contexts/chat/domain/ports/chat-profile.repository';
import { SendChatLineDto } from './send-chat-line.dto';
import { firstValueFrom } from 'rxjs';
import { ChatLineRepository } from '../../../domain/ports/chat-line.repository';
import {
  ChatLineModel,
  ChatLineModelInterface,
} from 'src/contexts/chat/domain/models/chat-line.model';
// import { firstValueFrom } from 'rxjs';

@Injectable()
export class SendChatLineUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatProfileRepository: ChatProfileRepository,
    private readonly chatLineRepository: ChatLineRepository,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async run(
    dto: SendChatLineDto,
    @NatsPayloadConfig() config?: NatsPayloadConfigInterface,
  ): Promise<{ chatLine: ChatLineModelInterface }> {
    const { chatId, message } = dto;
    const { authUserId } = config;

    let profile: any;
    let chatLineResult: ChatLineModelInterface;

    try {
      // Get profile of auth user
      const payloadGetProfiles: NatsPayloadInterface<string> = {
        ...config,
        data: authUserId,
      };

      const resGetProfile = await firstValueFrom(
        this.client.send(
          { cmd: 'profiles.find-profile-by-user-id' },
          payloadGetProfiles,
        ),
        { defaultValue: void 0 },
      );

      if (!resGetProfile.profile) {
        throw new RpcException('error');
      }

      profile = resGetProfile.profile;

      // Check chat exists

      const chatDb = await this.chatRepository.findById(chatId);
      if (!chatDb) {
        throw new RpcException('error');
      }

      // Check profile is in the chat
      const chatProfileDb =
        await this.chatProfileRepository.findByChatIdAndProfileId(
          chatId,
          profile.id,
        );
      if (!chatProfileDb) {
        throw new RpcException('error');
      }

      const chatLineAttributes: Partial<ChatLineModelInterface> = {
        chat_id: chatId,
        profile_id: profile.id,
        text: message,
      };
      const chatLineModel = ChatLineModel.create(chatLineAttributes);
      const chatLineInsert =
        await this.chatLineRepository.insert(chatLineModel);
      chatLineResult = chatLineInsert.toInterface();
    } catch (error) {
      console.log(error);

      throw new RpcException('error');
    }

    return {
      chatLine: chatLineResult,
    };
  }
}
