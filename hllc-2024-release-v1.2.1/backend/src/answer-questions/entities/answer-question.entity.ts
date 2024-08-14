import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { Question } from 'src/questions/schemas/question.schema';
import { QuestionEntity } from 'src/questions/entities/question.entity';
import { User } from 'src/users/schemas/user.schema';
import { UserEntity } from 'src/users/entities/user.entity';

export class AnswerQuestionEntity extends MongoEntity {
  @TransformId((value) => new QuestionEntity(value))
  question?: Types.ObjectId | Question | null;

  value: string;

  @TransformId((value) => new UserEntity(value))
  user?: Types.ObjectId | User | null;

  constructor(partial: Partial<AnswerQuestionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
