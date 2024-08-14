import { forwardRef, Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './items.premissions';
import { EvolutionsModule } from 'src/evolutions/evolutions.module';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    CaslModule.forFeature({ permissions }),
    forwardRef(() => EvolutionsModule),
    forwardRef(() => ActivitiesModule),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    ItemsService,
  ],
})
export class ItemsModule {}
