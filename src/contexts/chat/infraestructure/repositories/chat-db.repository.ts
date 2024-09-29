import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FailSaveDatabaseException } from '../../domain/exceptions/database/fail-save-database-exception';
import { FailDeleteDatabaseException } from '../../domain/exceptions/database/fail-delete-database-exception';
import { ChatRepository } from '../../domain/ports/chat.repository';
import { ChatModel, ChatModelInterface } from '../../domain/models/chat.model';

@Injectable()
export class ChatDbRepository extends ChatRepository {
  constructor(
    @Inject('CHAT_LINE_MODEL')
    private chatModel: Model<ChatModelInterface>,
  ) {
    super();
  }

  async insert(chatEntity: ChatModel): Promise<ChatModel> {
    const chat = new this.chatModel(chatEntity.toInterfaceDb());
    try {
      await chat.save();
    } catch (error) {
      console.log(error);
      throw new FailSaveDatabaseException('chat');
    }

    return ChatModel.createFromDb(chat.toObject());
  }

  async update(chatEntity: ChatModel): Promise<ChatModel> {
    const chat = chatEntity.toInterfaceDb();
    try {
      const updatedChat = await this.chatModel.findOneAndUpdate(
        { _id: chat._id },
        chat,
        {
          new: true,
          upsert: false,
          useFindAndModify: false,
        },
      );

      return ChatModel.createFromDb(updatedChat.toObject());
    } catch (error) {
      console.log(error);
      throw new FailSaveDatabaseException('chat');
    }
  }

  async delete(id: string): Promise<ChatModel> {
    const chat = await this.chatModel.findByIdAndDelete(id).exec();

    if (!chat) {
      throw new FailDeleteDatabaseException('chat');
    }

    return ChatModel.createFromDb(chat.toObject());
  }

  async findById(id: string): Promise<ChatModel | undefined> {
    const Chat = await this.chatModel.findById(id).exec();

    return Chat ? ChatModel.createFromDb(Chat.toObject()) : undefined;
  }
}
