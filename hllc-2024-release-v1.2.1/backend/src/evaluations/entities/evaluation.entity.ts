import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ActivityEntity } from 'src/activities/entities/activity.entity';
import { Activity } from 'src/activities/schemas/activities.schema';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { QuestionEntity } from 'src/questions/entities/question.entity';
import { Question } from 'src/questions/schemas/question.schema';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/schemas/user.schema';

export class EvaluationValueEntity extends MongoEntity {
  @TransformId((value) => new QuestionEntity(value))
  question?: Types.ObjectId | Question | null;

  value?: string;

  constructor(partial: Partial<EvaluationValueEntity>) {
    super();
    Object.assign(this, partial);
  }
}

export class EvaluationEntity extends MongoEntity {
  @Transform(({ value }) =>
    (value as EvaluationValue[]).map((v) => new EvaluationValueEntity(v)),
  )
  values: EvaluationValue[];

  @TransformId((value) => new UserEntity(value))
  author?: Types.ObjectId | User | null;

  @TransformId((value) => new ActivityEntity(value))
  activity?: Types.ObjectId | Activity | null;

  timestamp: Date;

  constructor(partial: Partial<EvaluationEntity>) {
    super();
    Object.assign(this, partial);
  }
}
