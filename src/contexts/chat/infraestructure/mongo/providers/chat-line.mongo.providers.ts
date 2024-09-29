import { Connection } from 'mongoose';
import ChatLineMongoSchema from '../schemas/chat-line.mongo.schema';
export const chatLineMongoProviders = [
  {
    provide: 'CHAT_LINE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('ChatLine', ChatLineMongoSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
