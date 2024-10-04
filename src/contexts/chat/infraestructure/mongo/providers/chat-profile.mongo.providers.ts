import { Connection } from 'mongoose';
import ChatProfileMongoSchema from '../schemas/chat-profile.mongo.schema';
export const chatProfileMongoProviders = [
  {
    provide: 'CHAT_PROFILE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('ChatProfile', ChatProfileMongoSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
