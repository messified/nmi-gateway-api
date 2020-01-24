import { Test, TestingModule } from '@nestjs/testing';
import { DirectPostController } from './direct-post.controller';

describe('DirectPost Controller', () => {
  let controller: DirectPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectPostController],
    }).compile();

    controller = module.get<DirectPostController>(DirectPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
