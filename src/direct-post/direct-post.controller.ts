import { Controller, Post, Body } from '@nestjs/common';
import { DirectPostService } from './direct-post.service';
import { IncomingRequest } from './request.interface';

@Controller('direct-post')
export class DirectPostController {
  constructor(private readonly directPostService: DirectPostService) {}

  @Post()
  async directPost(@Body() incomingRequest: IncomingRequest) {
    return await this.directPostService.processPayment(incomingRequest);
  }
}
