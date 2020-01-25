import { Controller, Post, Body } from '@nestjs/common';
import { DirectPostService } from './direct-post.service';

@Controller('direct-post')
export class DirectPostController {
  constructor(private readonly directPostService: DirectPostService) {}

  @Post()
  async directPost(@Body() incomingRequest: any) {
    return await this.directPostService.processPayment(incomingRequest);
  }
}
