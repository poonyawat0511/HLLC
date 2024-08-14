import { Module, forwardRef } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';
import { ActivitiesModule } from 'src/activities/activities.module';
import { CaslModule } from 'nest-casl';
import { permissions } from './questions.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    forwardRef(() => ActivitiesModule),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    QuestionsService,
  ],
})
export class QuestionsModule {}
