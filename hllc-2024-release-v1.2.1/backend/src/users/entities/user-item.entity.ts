import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { EvolutionEntity } from 'src/evolutions/entities/evolution.entity';
import { Evolution } from 'src/evolutions/schemas/evolution.schema';
import { ItemEntity } from 'src/items/entities/item.entity';

export class UserItemEntity extends ItemEntity {
  @TransformId((v) => new EvolutionEntity(v))
  evolution: Evolution | null;

  constructor(partial: Partial<UserItemEntity>) {
    super(partial);
  }
}
