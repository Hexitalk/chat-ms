import { Document } from 'mongoose';

export interface ChatLineMongoInterface extends Document {
  _id: string;
  chat_id: string;
  profile_id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}
