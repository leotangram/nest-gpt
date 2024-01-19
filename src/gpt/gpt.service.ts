import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';
import { OrthographyDTO } from './dtos';

@Injectable()
export class GptService {
  async orthographyCheck(orthographyDTO: OrthographyDTO) {
    return await orthographyCheckUseCase({
      prompt: orthographyDTO.prompt,
    });
  }
}
