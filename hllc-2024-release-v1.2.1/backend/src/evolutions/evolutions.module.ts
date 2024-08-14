import { forwardRef, Module } from '@nestjs/common';
import { EvolutionsService } from './evolutions.service';
import { EvolutionsController } from './evolutions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Evolution, EvolutionSchema } from './schemas/evolution.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './evolutions.premissions';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { EvaluationsModule } from 'src/evaluations/evaluations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evolution.name, schema: EvolutionSchema },
    ]),
    CaslModule.forFeature({ permissions }),
    forwardRef(() => UsersModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => EvaluationsModule),
    NotificationsModule,
  ],
  controllers: [EvolutionsController],
  providers: [EvolutionsService],
  exports: [
    MongooseModule.forFeature([
      { name: Evolution.name, schema: EvolutionSchema },
    ]),
  ],
})
export class EvolutionsModule {}
