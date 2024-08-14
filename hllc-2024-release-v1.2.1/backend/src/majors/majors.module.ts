import { Module, forwardRef } from '@nestjs/common';
import { MajorsService } from './majors.service';
import { MajorsController } from './majors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Major, MajorSchema } from './schemas/major.schema';
import { SchoolsModule } from '../schools/schools.module';
import { CaslModule } from 'nest-casl';
import { permissions } from './mojors.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Major.name, schema: MajorSchema }]),
    forwardRef(() => SchoolsModule),CaslModule.forFeature({ permissions }),
  ],
  controllers: [MajorsController],
  providers: [MajorsService],
  exports: [
    MajorsService,
    MongooseModule.forFeature([{ name: Major.name, schema: MajorSchema }]),
  ],
})
export class MajorsModule {}
