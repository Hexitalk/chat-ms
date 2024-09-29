import { Connection } from 'mongoose';
import ChatMongoSchema from '../schemas/chat.mongo.schema';
export const chatMongoProviders = [
  {
    provide: 'CHAT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Chat', ChatMongoSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
