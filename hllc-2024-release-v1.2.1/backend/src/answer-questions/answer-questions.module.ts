import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswerQuestionsService } from './answer-questions.service';
import { AnswerQuestionsController } from './answer-questions.controller';
import { AnswerQuestion, AnswerQuestionSchema } from "./schemas/answer-questions.schema";
import { UsersModule } from "src/users/users.module";
import { QuestionsModule  } from "src/questions/questions.module";
@Module({
  imports: [
    MongooseModule.forFeature([
      {name:AnswerQuestion.name, schema: AnswerQuestionSchema}
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => QuestionsModule),
  ],
  controllers: [AnswerQuestionsController],
  providers: [AnswerQuestionsService],
})
export class AnswerQuestionsModule {}
