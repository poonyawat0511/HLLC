import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { SettingType, SettingValue } from '../types/setting';
import { TransformUrl } from 'src/app/decorator/transform-url.decorator';
export class SettingEntity extends MongoEntity {
  key: string;

  @TransformUrl({ type: 'string' }, ({ obj }) => obj.type === 'image')
  value?: SettingValue | null;

  type: SettingType;

  group?: string;

  constructor(partial: Partial<SettingEntity>) {
    super();
    Object.assign(this, partial);
  }
}
