import { ChatModel } from '../models/chat.model';

export abstract class ChatRepository {
  abstract insert(chat: ChatModel): Promise<ChatModel>;
  abstract update(chat: ChatModel): Promise<ChatModel>;
  abstract delete(id: string): Promise<ChatModel>;
  abstract findById(id: string): Promise<ChatModel | undefined>;
}
