import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  checkCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListUseCase,
} from './use-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class SamAssistantService {
  private openAI = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openAI);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { threadId, question } = questionDto;

    // Message creation
    await createMessageUseCase(this.openAI, {
      threadId,
      question,
    });

    const run = await createRunUseCase(this.openAI, { threadId });

    await checkCompleteStatusUseCase(this.openAI, { runId: run.id, threadId });

    const messages = await getMessageListUseCase(this.openAI, { threadId });

    return messages.reverse();
  }
}
