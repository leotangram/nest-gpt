import * as path from 'path';
import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';

import {
  audioToTextUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
  orthographyCheckUseCase,
  prosConsDiscussionStreamUseCase,
  prosConsDiscussionUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  AudioToTextDTO,
  ImageGenerationDTO,
  ImageVariationDTO,
  OrthographyDTO,
  ProsConsDiscussionDTO,
  TextToAudioDTO,
  TranslateDTO,
} from './dtos';

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

  async translateText({ prompt, lang }: TranslateDTO) {
    return await translateUseCase(this.openAI, {
      prompt,
      lang,
    });
  }

  async textToAudio({ prompt, voice }: TextToAudioDTO) {
    return await textToAudioUseCase(this.openAI, {
      prompt,
      voice,
    });
  }

  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileId}.mp3`,
    );
    const wasFound = fs.existsSync(filePath);

    if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

    return filePath;
  }

  async audioToText({ audioFile, prompt }: AudioToTextDTO) {
    return await audioToTextUseCase(this.openAI, { audioFile, prompt });
  }

  async imageGeneration(imageGeneration: ImageGenerationDTO) {
    return await imageGenerationUseCase(this.openAI, { ...imageGeneration });
  }

  async getGeneratedImage(fileName: string) {
    const filePath = path.resolve('./', './generated/images/', fileName);
    const exist = fs.existsSync(filePath);

    if (!exist) {
      throw new NotFoundException('File not found');
    }

    return filePath;
  }

  async generateImageVariation({ baseImage }: ImageVariationDTO) {
    return imageVariationUseCase(this.openAI, { baseImage });
  }
}
