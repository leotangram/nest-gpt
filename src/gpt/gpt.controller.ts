import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GptService } from './gpt.service';
import { OrthographyDTO, ProsConsDiscussionDTO, TranslateDTO } from './dtos';

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

  @Post('pros-cons-discussion-stream')
  async prosConsDiscussionStream(
    @Body() prosConsDiscussionStreamDTO: ProsConsDiscussionDTO,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsDiscussionStream(
      prosConsDiscussionStreamDTO,
    );

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translateText(@Body() translateDTO: TranslateDTO) {
    return this.gptService.translateText(translateDTO);
  }
}
