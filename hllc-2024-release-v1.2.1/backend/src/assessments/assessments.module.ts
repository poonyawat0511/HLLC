import { Module, forwardRef } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';
import { Assessment, AssessmentSchema } from './schemas/assessments.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentSectionsModule } from 'src/assessment-sections/assessment-sections.module';
import { CaslModule } from 'nest-casl';
import { permissions } from './assessments.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema },
    ]),
    forwardRef(() => AssessmentSectionsModule),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [
    AssessmentsService,
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema },
    ]),
  ],
})
export class AssessmentsModule {}
