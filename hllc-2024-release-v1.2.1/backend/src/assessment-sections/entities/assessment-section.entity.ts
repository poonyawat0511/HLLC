import { MongoEntity } from 'src/app/common/lib/mongo.entiy';

export class AssessmentSectionEntity extends MongoEntity {
  title: {
    th: string;
    en: string;
  };

  subtitle: {
    th: string;
    en: string;
  };

  order: number;

  constructor(partial: Partial<AssessmentSectionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
