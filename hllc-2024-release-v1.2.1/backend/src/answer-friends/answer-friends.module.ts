import { forwardRef, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { QuestionnaireModule } from 'src/questionnaire/questionnaire.module';
import { AnswerQues, AnswerQuesSchema } from './schemas/answer-friends.schemas';
import { AnswerQuesController } from './answer-friends.controller';
import { AnswerFriendsService } from './answer-friends.service';
import { AnswerFriendsGateway } from './answer-friens.gateway';
import { AccessTokenModule } from 'src/auth/access-token/access-token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnswerQues.name, schema: AnswerQuesSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => QuestionnaireModule),
    AccessTokenModule
  ],
  controllers: [AnswerQuesController],
  providers: [AnswerFriendsService, AnswerFriendsGateway],
  exports: [
    MongooseModule.forFeature([
      { name: AnswerQues.name, schema: AnswerQuesSchema },
    ]),
    AnswerFriendsService,
  ],
})
export class AnswerFriendsModule {}
