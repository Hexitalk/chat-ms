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
import { ChatModelInterface } from 'src/contexts/chat/domain/models/chat.model';
import { ChatProfileRepository } from 'src/contexts/chat/domain/ports/chat-profile.repository';
import { GetChatDto } from './get-chat.dto';
import { ChatLineRepository } from 'src/contexts/chat/domain/ports/chat-line.repository';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GetChatUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatProfileRepository: ChatProfileRepository,
    private readonly chatLineRepository: ChatLineRepository,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async run(
    dto: GetChatDto,
    @NatsPayloadConfig() config?: NatsPayloadConfigInterface,
  ): Promise<{ chat: ChatModelInterface }> {
    const { targetProfileId } = dto;

    const { authUserId } = config;

    if (!targetProfileId || !authUserId) {
      throw new RpcException('error');
    }

    let responseChat: ChatModelInterface;

    try {
      const payloadGetUserProfileId: NatsPayloadInterface<string> = {
        ...config,
        data: authUserId,
      };

      const resGetUserProfileId = await firstValueFrom(
        this.client.send(
          { cmd: 'profiles.find-profile-by-user-id' },
          payloadGetUserProfileId,
        ),
        { defaultValue: void 0 },
      );

      const originProfileId = resGetUserProfileId.profile.id;

      const profilesIds = [originProfileId, targetProfileId];

      const chatId =
        await this.chatProfileRepository.findChatIdByProfilesIds(profilesIds);

      if (!chatId) {
        throw new RpcException('error');
      }

      const chatDb = await this.chatRepository.findById(chatId);

      if (!chatDb) {
        throw new RpcException('error');
      }

      const chatInterface = chatDb.toInterface();
      chatInterface.chats_profiles = [];

      for (let i = 0; i < profilesIds.length; i++) {
        const profileId = profilesIds[i];
        const chatProfileDb =
          await this.chatProfileRepository.findByChatIdAndProfileId(
            chatId,
            profileId,
          );
        if (!chatProfileDb) {
          throw new RpcException('error');
        }
        chatInterface.chats_profiles.push(chatProfileDb.toInterface());
      }

      const payloadGetProfiles: NatsPayloadInterface<{
        profilesIds: string[];
      }> = {
        ...config,
        data: {
          profilesIds: chatInterface.chats_profiles.map((cp) => cp.profile_id),
        },
      };

      const resGetProfiles = await firstValueFrom(
        this.client.send(
          { cmd: 'profiles.find-list-profiles-by-ids' },
          payloadGetProfiles,
        ),
        { defaultValue: void 0 },
      );

      chatInterface.chats_profiles = chatInterface.chats_profiles.map((cp) => {
        cp.profile = resGetProfiles.profiles.find((p) => p.id == cp.profile_id);
        return cp;
      });

      const chatLinesDb =
        await this.chatLineRepository.getListLastByChatId(chatId);

      chatInterface.chat_lines = chatLinesDb.chatLines.map((cl) =>
        cl.toInterface(),
      );

      responseChat = chatInterface;
    } catch (error) {
      console.log(error);

      throw new RpcException('error');
    }

    return {
      chat: responseChat,
    };
  }
}
