import { Expose } from 'class-transformer';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';
export class QuestionEntity extends MongoEntity {
  title: {
    th: string;
    en: string;
  };

  text: {
    th: string;
    en: string;
  };
  
  @TransformUrl({ type: 'string' })
  image: string;

  constructor(partial: Partial<QuestionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
