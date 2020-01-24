import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DirectPostService } from './direct-post/direct-post.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      expandVariables: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DirectPostService],
})
export class AppModule {}
