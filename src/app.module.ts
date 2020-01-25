import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DirectPostService } from './direct-post/direct-post.service';
import { DirectPostController } from './direct-post/direct-post.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      expandVariables: true,
    }),
  ],
  controllers: [AppController, DirectPostController],
  providers: [AppService, DirectPostService],
})
export class AppModule {}
