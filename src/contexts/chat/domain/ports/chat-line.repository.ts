import { ChatLineModel } from '../models/chat-line.model';

export abstract class ChatLineRepository {
  abstract insert(chatLine: ChatLineModel): Promise<ChatLineModel>;
  abstract update(chatLine: ChatLineModel): Promise<ChatLineModel>;
  abstract delete(id: string): Promise<ChatLineModel>;
  abstract findById(id: string): Promise<ChatLineModel | undefined>;
  abstract getListLastByChatId(
    chatId: string,
    limit?: number,
    lastChatLineId?: string,
  ): Promise<{ chatLines: ChatLineModel[] }>;
}
