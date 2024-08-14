import { Module, forwardRef } from '@nestjs/common';
import { AssessmentSectionsService } from './assessment-sections.service';
import { AssessmentSectionsController } from './assessment-sections.controller';
import {
  AssessmentSection,
  AssessmentSectionSchema,
} from './schemas/assessment-section.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentsModule } from 'src/assessments/assessments.module';
import { CaslModule } from 'nest-casl';
import { permissions } from './assessment-sections.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssessmentSection.name, schema: AssessmentSectionSchema },
    ]),
    forwardRef(() => AssessmentsModule),CaslModule.forFeature({ permissions }),
  ],
  controllers: [AssessmentSectionsController],
  providers: [AssessmentSectionsService],
  exports: [
    MongooseModule.forFeature([
      { name: AssessmentSection.name, schema: AssessmentSectionSchema },
    ]),
    AssessmentSectionsService,
  ],
})
export class AssessmentSectionsModule {}
