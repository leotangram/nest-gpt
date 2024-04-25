import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import {
  orthographyCheckUseCase,
  prosConsDiscussionStreamUseCase,
  prosConsDiscussionUseCase,
} from './use-cases';
import { OrthographyDTO, ProsConsDiscussionDTO } from './dtos';

@Injectable()
export class GptService {
  private openAI = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  async orthographyCheck(orthographyDTO: OrthographyDTO) {
    return await orthographyCheckUseCase(this.openAI, {
      prompt: orthographyDTO.prompt,
    });
  }

  async prosConsDiscussion(prosConsDiscussionDTO: ProsConsDiscussionDTO) {
    return await prosConsDiscussionUseCase(this.openAI, {
      prompt: prosConsDiscussionDTO.prompt,
    });
  }

  async prosConsDiscussionStream(
    prosConsDiscussionStreamDTO: ProsConsDiscussionDTO,
  ) {
    return await prosConsDiscussionStreamUseCase(this.openAI, {
      prompt: prosConsDiscussionStreamDTO.prompt,
    });
  }
}
