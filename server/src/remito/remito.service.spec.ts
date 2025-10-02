import { Test, TestingModule } from '@nestjs/testing';
import { RemitoService } from './remito.service';

describe('RemitoService', () => {
  let service: RemitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemitoService],
    }).compile();

    service = module.get<RemitoService>(RemitoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
