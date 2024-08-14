
import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { QuestionnaireEntity } from 'src/questionnaire/entities/questionnaire.entity';
import { Questionnaire } from 'src/questionnaire/schemas/questionnaire.schema';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/schemas/user.schema';

export class AnswerQueEntity extends MongoEntity {
  @TransformId((v) => new UserEntity(v))
  sender?: Types.ObjectId | User | null;

  @TransformId((v) => new UserEntity(v))
  receiver?: Types.ObjectId | User | null;

  @TransformId((v) => new QuestionnaireEntity(v))
  questionnaire?: Types.ObjectId | Questionnaire | null;

  @TransformId((v) => new AnswerQueEntity(v))
  questions: {
    questionnaire?: Types.ObjectId | Questionnaire | null;
    answer: string;
  }[];

  constructor(partial: Partial<AnswerQueEntity>) {
    super();
    Object.assign(this, partial);
  }
}
