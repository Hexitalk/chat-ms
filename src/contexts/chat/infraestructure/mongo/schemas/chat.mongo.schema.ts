import * as mongoose from 'mongoose';

const ChatMongoSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    last_message_date: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export default ChatMongoSchema;
