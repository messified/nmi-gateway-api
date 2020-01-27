import { Controller, Post, Body } from '@nestjs/common';
import { DirectPostService } from './direct-post.service';
import { RawRequest } from './request.interface';

@Controller('direct-post')
export class DirectPostController {
  constructor(private readonly directPostService: DirectPostService) {}

  @Post()
  async directPost(@Body() rawRequest: RawRequest) {
    return await this.directPostService.processPayment(rawRequest);
  }
}
