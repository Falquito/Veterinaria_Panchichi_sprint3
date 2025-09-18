import { Test, TestingModule } from '@nestjs/testing';
import { RemitoController } from './remito.controller';
import { RemitoService } from './remito.service';

describe('RemitoController', () => {
  let controller: RemitoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemitoController],
      providers: [RemitoService],
    }).compile();

    controller = module.get<RemitoController>(RemitoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
