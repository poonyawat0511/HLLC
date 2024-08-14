import { Expose } from 'class-transformer';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';

export class QuestionnaireEntity extends MongoEntity {
  @Expose()
  questionnaire: {
    th: string;
    en: string;
  };
  
  type: string;

  constructor(partial: Partial<QuestionnaireEntity>) {
    super();
    Object.assign(this, partial);
  }
}
