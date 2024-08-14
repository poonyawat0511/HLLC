import { Module } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema } from './schemas/evaluation.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './evaluations.permissions';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { EvolutionsModule } from 'src/evolutions/evolutions.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
    ]),
    CaslModule.forFeature({ permissions }),
    NotificationsModule,
    EvolutionsModule,
    ItemsModule,
  ],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
  exports: [
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
    ]),
    EvaluationsService,
  ],
})
export class EvaluationsModule {}
