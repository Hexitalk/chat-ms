export interface ChatLineModelInterface {
  id: string;
  chat_id: string;
  profile_id: string;
  text: string;
  create_date: string;
  update_date: string;
}

export interface ChatLineModelInterfaceDb {
  _id: string;
  chat_id: string;
  profile_id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export class ChatLineModel {
  private constructor(private attributes: ChatLineModelInterface) {}

  static create(attributes: Partial<ChatLineModelInterface>): ChatLineModel {
    return new ChatLineModel({
      id: attributes.id ?? undefined,
      chat_id: attributes.chat_id ?? null,
      profile_id: attributes.profile_id ?? null,
      text: attributes.text ?? '',
      create_date: attributes.create_date ?? '',
      update_date: attributes.update_date ?? '',
    });
  }

  static createFromDb(
    attributes: Partial<ChatLineModelInterfaceDb>,
  ): ChatLineModel {
    return new ChatLineModel({
      id: attributes._id ?? undefined,
      chat_id: attributes.chat_id ?? null,
      profile_id: attributes.profile_id ?? null,
      text: attributes.text ?? '',
      create_date: attributes.createdAt ?? '',
      update_date: attributes.updatedAt ?? '',
    });
  }

  toInterface(): ChatLineModelInterface {
    return {
      ...this.attributes,
      id: this.attributes.id.toString(),
      chat_id: this.attributes.chat_id
        ? this.attributes.chat_id.toString()
        : null,
      profile_id: this.attributes.profile_id
        ? this.attributes.profile_id.toString()
        : null,
    };
  }

  toInterfaceDb(): ChatLineModelInterfaceDb {
    return {
      ...this.attributes,
      _id: this.attributes.id,
      createdAt: this.attributes.create_date,
      updatedAt: this.attributes.update_date,
    };
  }
}
