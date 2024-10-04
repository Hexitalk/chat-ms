import { ChatProfileModel } from '../models/chat-profile.model';

export abstract class ChatProfileRepository {
  abstract insert(chatProfile: ChatProfileModel): Promise<ChatProfileModel>;
  abstract update(chatProfile: ChatProfileModel): Promise<ChatProfileModel>;
  abstract delete(id: string): Promise<ChatProfileModel>;
  abstract findById(id: string): Promise<ChatProfileModel | undefined>;
  abstract findByChatIdAndProfileId(
    chatId: string,
    profileId: string,
  ): Promise<ChatProfileModel | undefined>;
  abstract findChatIdByProfilesIds(
    profilesIds: string[],
  ): Promise<string | undefined>;
  abstract getListByChatId(
    chatId: string,
  ): Promise<{ chatsProfiles: ChatProfileModel[] }>;
}
