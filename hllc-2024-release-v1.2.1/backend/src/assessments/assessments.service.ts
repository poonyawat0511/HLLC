import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Assessment } from './schemas/assessments.schema';
import { Model } from 'mongoose';
import { AssessmentStatus } from './enums/assessment-status.enum';

@Injectable()
export class AssessmentsService {
  private readonly errorBuilder = new ErrorBuilder('Assessment');

  constructor(
    @InjectModel(Assessment.name) private AssessmentModel: Model<Assessment>,
  ) {}

  async create(createAssessmentDto: CreateAssessmentDto): Promise<Assessment> {
    try {
      const assessmentDoc = new this.AssessmentModel(createAssessmentDto);
      const assessment = await assessmentDoc.save();
      return assessment.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Assessment[]> {
    const assessments = await this.AssessmentModel.find()
      .populate('section')
      .lean();
    return assessments;
  }

  async findOne(id: string): Promise<Assessment> {
    const assessment = await this.AssessmentModel.findById(id).lean();
    if (!assessment) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return assessment;
  }

  async findByStatusPosttest(): Promise<Assessment[]> {
    const assessments = await this.AssessmentModel.find({
      status: AssessmentStatus.pretest,
    })
      .populate('section')
      .lean();
    return assessments;
  }

  async findByStatusPretestPosttest(): Promise<Assessment[]> {
    const assessments = await this.AssessmentModel.find({
      status: [AssessmentStatus.pretest, AssessmentStatus.posttest],
    })
      .populate('section')
      .lean();
    return assessments;
  }

  async findAssessmentByActivityId(activityId: string): Promise<Assessment[]> {
    const assessments = await this.AssessmentModel.find({
      status: AssessmentStatus.activity,
      activity: activityId,
    }).lean();
    return assessments;
  }

  async update(
    id: string,
    updateAssessmentDto: UpdateAssessmentDto,
  ): Promise<Assessment> {
    try {
      const exists = await this.AssessmentModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const assessment = await this.AssessmentModel.findByIdAndUpdate(
        id,
        updateAssessmentDto,
        { new: true },
      ).lean();
      return assessment;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    const assessment = await this.AssessmentModel.findByIdAndDelete(id).lean();
    if (!assessment) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return assessment;
  }
}
