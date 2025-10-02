import { Test, TestingModule } from '@nestjs/testing';
import { RemitoController } from './remito.controller';

describe('RemitoController', () => {
  let controller: RemitoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemitoController],
    }).compile();

    controller = module.get<RemitoController>(RemitoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
