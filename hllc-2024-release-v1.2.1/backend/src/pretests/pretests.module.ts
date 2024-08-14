import { Module, forwardRef } from '@nestjs/common';
import { PretestService } from './pretests.service';
import { PretestController } from './pretests.controller';
import { PretestSchema } from './schemas/pretest.schema';
import { Pretest } from './schemas/pretest.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { AssessmentsModule } from 'src/assessments/assessments.module';
import { CaslModule } from 'nest-casl';
import { permissions } from './pretests.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pretest.name, schema: PretestSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => AssessmentsModule),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [PretestController],
  providers: [PretestService],
  exports: [
    MongooseModule.forFeature([{ name: Pretest.name, schema: PretestSchema }]),
    PretestService,
  ],
})
export class PretestsModule {}
