import { Document } from 'mongoose';

export interface ChatProfileMongoInterface extends Document {
  _id: string;
  chat_id: string;
  profile_id: string;
  createdAt: string;
  updatedAt: string;
}
