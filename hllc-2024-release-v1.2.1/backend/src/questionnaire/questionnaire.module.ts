import { Module } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireController } from './questionnaire.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Questionnaire, QuestionnaireSchema } from './schemas/questionnaire.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Questionnaire.name, schema: QuestionnaireSchema },
    ]),
  ],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService],
  exports: [
    MongooseModule.forFeature([
      { name: QuestionnaireController.name, schema: QuestionnaireSchema },
    ]),
    QuestionnaireService,
  ],
})
export class QuestionnaireModule {}
