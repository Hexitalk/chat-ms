import { ChatLineModelInterface } from './chat-line.model';
import { ChatProfileModelInterface } from './chat-profile.model';

export interface ChatModelInterface {
  id: string;
  chat_lines: ChatLineModelInterface[];
  chats_profiles: ChatProfileModelInterface[];
  last_message_date: string;
  create_date: string;
  update_date: string;
}

export interface ChatModelInterfaceDb {
  _id: string;
  chat_lines: ChatLineModelInterface[];
  chats_profiles: ChatProfileModelInterface[];
  last_message_date: string;
  createdAt: string;
  updatedAt: string;
}

export class ChatModel {
  private constructor(private attributes: ChatModelInterface) {}

  static create(attributes: Partial<ChatModelInterface>): ChatModel {
    return new ChatModel({
      id: attributes.id ?? undefined,
      chat_lines: attributes.chat_lines ?? [],
      chats_profiles: attributes.chats_profiles ?? [],
      last_message_date: attributes.last_message_date ?? '',
      create_date: attributes.create_date ?? '',
      update_date: attributes.update_date ?? '',
    });
  }

  static createFromDb(attributes: Partial<ChatModelInterfaceDb>): ChatModel {
    return new ChatModel({
      id: attributes._id ?? undefined,
      chat_lines: attributes.chat_lines ?? [],
      chats_profiles: attributes.chats_profiles ?? [],
      last_message_date: attributes.last_message_date ?? '',
      create_date: attributes.createdAt ?? '',
      update_date: attributes.updatedAt ?? '',
    });
  }

  toInterface(): ChatModelInterface {
    return {
      ...this.attributes,
      id: this.attributes.id.toString(),
    };
  }

  toInterfaceDb(): ChatModelInterfaceDb {
    return {
      ...this.attributes,
      _id: this.attributes.id,
      createdAt: this.attributes.create_date,
      updatedAt: this.attributes.update_date,
    };
  }
}
