import { Module, forwardRef } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from './schemas/school.schema';
import { MajorsModule } from '../majors/majors.module';
import { ColorsModule } from '../themes/themes.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import configuration from 'src/app/config/configuration';
import { CaslModule } from 'nest-casl';
import { permissions } from './schools.permissions';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
    forwardRef(() => MajorsModule),
    forwardRef(() => ColorsModule),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
    SchoolsService,
  ],
})
export class SchoolsModule {}
