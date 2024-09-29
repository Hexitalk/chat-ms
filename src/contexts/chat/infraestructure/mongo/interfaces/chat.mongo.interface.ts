import { Document } from 'mongoose';
import { ChatLineMongoInterface } from './chat-Line.mongo.interface';

export interface ChatMongoInterface extends Document {
  _id: string;
  chat_lines: ChatLineMongoInterface[];
  last_message_date: string;
  createdAt: string;
  updatedAt: string;
}
