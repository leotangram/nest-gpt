import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { GptService } from './gpt.service';
import {
  OrthographyDTO,
  ProsConsDiscussionDTO,
  TextToAudioDTO,
  TranslateDTO,
} from './dtos';

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

  @Post('text-to-audio')
  async textToAudio(@Body() textToAudio: TextToAudioDTO, @Res() res: Response) {
    const filePath = await this.gptService.textToAudio(textToAudio);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }
}
