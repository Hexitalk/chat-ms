import * as mongoose from 'mongoose';

const ChatLineMongoSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    profile_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default ChatLineMongoSchema;
