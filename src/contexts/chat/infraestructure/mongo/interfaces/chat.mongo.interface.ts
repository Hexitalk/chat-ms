import { Document } from 'mongoose';

export interface ChatMongoInterface extends Document {
  _id: string;
  last_message_date: string;
  createdAt: string;
  updatedAt: string;
}
