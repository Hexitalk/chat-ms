import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/contexts/shared/database/database.module';
import { NatsModule } from 'src/contexts/shared/nats/nats.module';

import * as path from 'path';
import * as useCases from '../application/use-cases/index';
import * as controllers from './controllers/index';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RpcExceptionInterceptor } from '../../shared/interceptors/rpc-exception-translate.interceptor';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { NatsLanguageResolver } from '../../shared/i18n-resolvers/nats-language.resolver';
import { ChatDbRepository } from './repositories/chat-db.repository';
import { ChatRepository } from '../domain/ports/chat.repository';
import { ChatLineDbRepository } from './repositories/chat-line-db.repository';
import { ChatLineRepository } from '../domain/ports/chat-line.repository';
import { chatMongoProviders } from './mongo/providers/chat.mongo.providers';
import { chatLineMongoProviders } from './mongo/providers/chat-line.mongo.providers';
import { chatProfileMongoProviders } from './mongo/providers/chat-profile.mongo.providers';
import { ChatProfileDbRepository } from './repositories/chat-profile-db.repository';
import { ChatProfileRepository } from '../domain/ports/chat-profile.repository';

@Module({
  imports: [
    NatsModule,
    DatabaseModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        loader: I18nJsonLoader,
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [{ use: NatsLanguageResolver, options: {} }],
    }),
  ],
  controllers: [...Object.values(controllers)],
  providers: [
    ...chatMongoProviders,
    ...chatLineMongoProviders,
    ...chatProfileMongoProviders,
    ...Object.values(useCases),
    ChatDbRepository,
    {
      provide: ChatRepository,
      useExisting: ChatDbRepository,
    },
    ChatLineDbRepository,
    {
      provide: ChatLineRepository,
      useExisting: ChatLineDbRepository,
    },
    ChatProfileDbRepository,
    {
      provide: ChatProfileRepository,
      useExisting: ChatProfileDbRepository,
    },
    NatsLanguageResolver,
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcExceptionInterceptor,
    },
  ],
  exports: [
    ...Object.values(useCases),
    ChatDbRepository,
    {
      provide: ChatRepository,
      useExisting: ChatDbRepository,
    },
  ],
})
export class ChatModule {}
