import { Exclude, Expose } from 'class-transformer';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { AdminRoles } from 'src/auth/enums/roles.enum';
import { MajorEntity } from 'src/majors/entities/major.entity';
import { Major } from 'src/majors/schemas/major.schema';

export class AdminEntity extends MongoEntity {
  name: {
    first: string;
    last: string;
  };

  username: string;

  role: AdminRoles;

  @Exclude()
  password: string;

  @TransformId((value) => new MajorEntity(value))
  major?: string | Major;

  @Expose()
  get fullName(): string {
    return `${this.name.first} ${this.name.last}`;
  }

  constructor(partial: Partial<AdminEntity>) {
    super();
    Object.assign(this, partial);
  }
}
