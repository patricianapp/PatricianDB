import { Test, TestingModule } from '@nestjs/testing';
import { MbController } from './mb.controller';

describe('MbController', () => {
  let controller: MbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MbController],
    }).compile();

    controller = module.get<MbController>(MbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
