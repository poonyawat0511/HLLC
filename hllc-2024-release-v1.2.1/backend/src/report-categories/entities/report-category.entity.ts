import { MongoEntity } from 'src/app/common/lib/mongo.entiy';

export class ReportCategoryEntity extends MongoEntity {
  name: { th: string; en: string };

  constructor(partial: Partial<ReportCategoryEntity>) {
    super();
    Object.assign(this, partial);
  }
}
