import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { ReportCategoryEntity } from 'src/report-categories/entities/report-category.entity';
import { ReportCategory } from 'src/report-categories/schemas/report-category.schema';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/schemas/user.schema';

export class ReportEntity extends MongoEntity {
  message: string;

  @TransformId((v) => new UserEntity(v))
  reporter?: Types.ObjectId | User | null;

  @TransformId((v) => new ReportCategoryEntity(v))
  category?: Types.ObjectId | ReportCategory | null;

  constructor(partial: Partial<ReportEntity>) {
    super();
    Object.assign(this, partial);
  }
}
