export interface ChatProfileModelInterface {
  id: string;
  chat_id: string;
  profile_id: string;
  profile: any;
  create_date: string;
  update_date: string;
}

export interface ChatProfileModelInterfaceDb {
  _id: string;
  chat_id: string;
  profile_id: string;
  createdAt: string;
  updatedAt: string;
}

export class ChatProfileModel {
  private constructor(private attributes: ChatProfileModelInterface) {}

  static create(
    attributes: Partial<ChatProfileModelInterface>,
  ): ChatProfileModel {
    return new ChatProfileModel({
      id: attributes.id ?? undefined,
      chat_id: attributes.chat_id ?? null,
      profile_id: attributes.profile_id ?? null,
      profile: undefined,
      create_date: attributes.create_date ?? '',
      update_date: attributes.update_date ?? '',
    });
  }

  static createFromDb(
    attributes: Partial<ChatProfileModelInterfaceDb>,
  ): ChatProfileModel {
    return new ChatProfileModel({
      id: attributes._id ?? undefined,
      chat_id: attributes.chat_id ?? null,
      profile_id: attributes.profile_id ?? null,
      profile: undefined,
      create_date: attributes.createdAt ?? '',
      update_date: attributes.updatedAt ?? '',
    });
  }

  toInterface(): ChatProfileModelInterface {
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

  toInterfaceDb(): ChatProfileModelInterfaceDb {
    return {
      ...this.attributes,
      _id: this.attributes.id,
      createdAt: this.attributes.create_date,
      updatedAt: this.attributes.update_date,
    };
  }
}
