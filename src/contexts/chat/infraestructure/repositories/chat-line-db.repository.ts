import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
// import { NotFoundDatabaseException } from '../../domain/exceptions/database/not-found-database-exception';
import { FailSaveDatabaseException } from '../../domain/exceptions/database/fail-save-database-exception';
import { FailDeleteDatabaseException } from '../../domain/exceptions/database/fail-delete-database-exception';
import { ChatLineRepository } from '../../domain/ports/chat-line.repository';
import {
  ChatLineModel,
  ChatLineModelInterface,
} from '../../domain/models/chat-line.model';

@Injectable()
export class ChatLineDbRepository extends ChatLineRepository {
  constructor(
    @Inject('CHAT_LINE_MODEL')
    private chatLineModel: Model<ChatLineModelInterface>,
  ) {
    super();
  }

  async insert(chatLineEntity: ChatLineModel): Promise<ChatLineModel> {
    const chatLine = new this.chatLineModel(chatLineEntity.toInterfaceDb());
    try {
      await chatLine.save();
    } catch (error) {
      console.log(error);
      throw new FailSaveDatabaseException('chat line');
    }

    return ChatLineModel.createFromDb(chatLine.toObject());
  }

  async update(chatLineEntity: ChatLineModel): Promise<ChatLineModel> {
    const chatLine = chatLineEntity.toInterfaceDb();
    try {
      const updatedChatLine = await this.chatLineModel.findOneAndUpdate(
        { _id: chatLine._id },
        chatLine,
        {
          new: true,
          upsert: false,
          useFindAndModify: false,
        },
      );

      return ChatLineModel.createFromDb(updatedChatLine.toObject());
    } catch (error) {
      console.log(error);
      throw new FailSaveDatabaseException('chat line');
    }
  }

  async delete(id: string): Promise<ChatLineModel> {
    const chatLine = await this.chatLineModel.findByIdAndDelete(id).exec();

    if (!chatLine) {
      throw new FailDeleteDatabaseException('chat line');
    }

    return ChatLineModel.createFromDb(chatLine.toObject());
  }

  async findById(id: string): Promise<ChatLineModel | undefined> {
    const ChatLine = await this.chatLineModel.findById(id).exec();

    return ChatLine
      ? ChatLineModel.createFromDb(ChatLine.toObject())
      : undefined;
  }

  async getListLastByChatId(
    chatId: string,
    limit?: number,
    lastChatLineId?: string,
  ) {
    let query = this.chatLineModel.find({ chat_id: chatId });

    const limitChatLines = limit ?? 20;

    query = query.limit(limitChatLines);

    if (lastChatLineId) {
      try {
        const lastChatLine = await this.findById(lastChatLineId);
        if (lastChatLine) {
          const { createdAt } = lastChatLine.toInterfaceDb();
          const createdAtDate = new Date(createdAt).getTime();
          query = query.where('createdAt').lt(createdAtDate);
        }
      } catch (error) {}
    }

    const chatLines = await query.exec();

    return {
      chatLines: chatLines.map((e) => ChatLineModel.createFromDb(e.toObject())),
    };
  }
}
