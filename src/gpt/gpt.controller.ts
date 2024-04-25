import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDTO, ProsConsDiscussionDTO } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDTO: OrthographyDTO) {
    return this.gptService.orthographyCheck(orthographyDTO);
  }

  @Post('pros-cons-discussion')
  prosConsDiscussion(@Body() prosConsDiscussionDTO: ProsConsDiscussionDTO) {
    return this.gptService.prosConsDiscussion(prosConsDiscussionDTO);
  }
}
