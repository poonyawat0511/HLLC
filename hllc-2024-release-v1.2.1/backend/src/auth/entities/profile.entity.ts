import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { ThemeEntity } from 'src/themes/entities/theme.entity';
import { Theme } from 'src/themes/schemas/theme.schema';
import { UserEntity } from 'src/users/entities/user.entity';

export class ProfileEntity extends UserEntity {
  pretest: 0 | 1;

  posttest: 0 | 1;

  @TransformId((v) => new ThemeEntity(v))
  theme: Theme;

  constructor(partial: Partial<ProfileEntity>) {
    super(partial);
  }
}
