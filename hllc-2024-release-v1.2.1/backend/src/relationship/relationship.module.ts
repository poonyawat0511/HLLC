import { forwardRef, Module } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { RelationshipController } from './relationship.controller';
import {
  RelationShip,
  RelationShipSchema,
} from './schemas/relationship.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RelationShip.name, schema: RelationShipSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [RelationshipController],
  providers: [RelationshipService],
  exports: [
    MongooseModule.forFeature([
      { name: RelationShip.name, schema: RelationShipSchema },
    ]),
  ],
})
export class RelationshipModule {}
