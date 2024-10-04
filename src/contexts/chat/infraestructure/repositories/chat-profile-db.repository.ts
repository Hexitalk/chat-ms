import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
// import { NotFoundDatabaseException } from '../../domain/exceptions/database/not-found-database-exception';
import { FailSaveDatabaseException } from '../../domain/exceptions/database/fail-save-database-exception';
import { FailDeleteDatabaseException } from '../../domain/exceptions/database/fail-delete-database-exception';
import { ChatProfileRepository } from '../../domain/ports/chat-profile.repository';
import {
  ChatProfileModel,
  ChatProfileModelInterface,
} from '../../domain/models/chat-profile.model';

@Injectable()
export class ChatProfileDbRepository extends ChatProfileRepository {
  constructor(
    @Inject('CHAT_PROFILE_MODEL')
    private chatProfileModel: Model<ChatProfileModelInterface>,
  ) {
    super();
  }

  async insert(chatProfileEntity: ChatProfileModel): Promise<ChatProfileModel> {
    const chatProfile = new this.chatProfileModel(
      chatProfileEntity.toInterfaceDb(),
    );
    try {
      await chatProfile.save();
    } catch (error) {
      console.log(error);
      throw new FailSaveDatabaseException('chat line');
    }

    return ChatProfileModel.createFromDb(chatProfile.toObject());
  }

  async update(chatProfileEntity: ChatProfileModel): Promise<ChatProfileModel> {
    const chatProfile = chatProfileEntity.toInterfaceDb();
    try {
      const updatedChatProfile = await this.chatProfileModel.findOneAndUpdate(
        { _id: chatProfile._id },
        chatProfile,
        {
          new: true,
          upsert: false,
          useFindAndModify: false,
        },
      );

      return ChatProfileModel.createFromDb(updatedChatProfile.toObject());
    } catch (error) {
      console.log(error);
      throw new FailSaveDatabaseException('chat line');
    }
  }

  async delete(id: string): Promise<ChatProfileModel> {
    const chatProfile = await this.chatProfileModel
      .findByIdAndDelete(id)
      .exec();

    if (!chatProfile) {
      throw new FailDeleteDatabaseException('chat line');
    }

    return ChatProfileModel.createFromDb(chatProfile.toObject());
  }

  async findById(id: string): Promise<ChatProfileModel | undefined> {
    const ChatProfile = await this.chatProfileModel.findById(id).exec();

    return ChatProfile
      ? ChatProfileModel.createFromDb(ChatProfile.toObject())
      : undefined;
  }

  async getListByChatId(chatId: string) {
    const query = this.chatProfileModel.find({ chat_id: chatId });

    const chatsProfiles = await query.exec();

    return {
      chatsProfiles: chatsProfiles.map((e) =>
        ChatProfileModel.createFromDb(e.toObject()),
      ),
    };
  }

  async findByChatIdAndProfileId(
    chatId: string,
    profileId: string,
  ): Promise<ChatProfileModel | undefined> {
    const chatProfile = await this.chatProfileModel
      .findOne({
        chat_id: chatId,
        profile_id: profileId,
      })
      .exec();

    return chatProfile
      ? ChatProfileModel.createFromDb(chatProfile.toObject())
      : undefined;
  }

  async findChatIdByProfilesIds(
    profilesIds: string[],
  ): Promise<string | undefined> {
    const objectIdProfiles = profilesIds.map((id) => new Types.ObjectId(id));

    const chatsProfiles = await this.chatProfileModel
      .aggregate([
        {
          $match: {
            profile_id: { $in: objectIdProfiles },
          },
        },
        {
          $group: {
            _id: '$chat_id',
            profileCount: { $sum: 1 }, // Contar los perfiles por chat
          },
        },
        {
          $match: {
            profileCount: profilesIds.length, // Asegurarse de que haya exactamente la misma cantidad de perfiles que IDs
          },
        },
        {
          $project: {
            _id: 0,
            chat_id: '$_id',
            // profile_id: '$profile_id',
          },
        },
      ])
      .exec();

    const firstChatResult: { chat_id: Types.ObjectId } = chatsProfiles[0];
    if (!firstChatResult) {
      throw new FailDeleteDatabaseException('chat line');
    }

    const chatId = firstChatResult.chat_id.toString();

    return chatId;
  }
}
