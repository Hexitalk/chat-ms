import { Module } from '@nestjs/common';
import { ChatModule } from './contexts/chat/infraestructure/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
