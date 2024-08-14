import { forwardRef, Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './admins.permissions';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    CaslModule.forFeature({ permissions }),
    forwardRef(() => ActivitiesModule),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    AdminsService,
  ],
})
export class AdminsModule {}
