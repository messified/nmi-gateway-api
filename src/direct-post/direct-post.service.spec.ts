import { Test, TestingModule } from '@nestjs/testing';
import { DirectPostService } from './direct-post.service';

describe('DirectPostService', () => {
  let service: DirectPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectPostService],
    }).compile();

    service = module.get<DirectPostService>(DirectPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
