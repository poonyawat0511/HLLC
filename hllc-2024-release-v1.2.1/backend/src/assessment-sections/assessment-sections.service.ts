import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssessmentSectionDto } from './dto/create-assessment-section.dto';
import { UpdateAssessmentSectionDto } from './dto/update-assessment-section.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import {
  AssessmentSection,
  AssessmentSectionDocument,
} from './schemas/assessment-section.schema';
import { Model } from 'mongoose';

@Injectable()
export class AssessmentSectionsService {
  private readonly errorBuilder = new ErrorBuilder('AssessmentSection');

  constructor(
    @InjectModel(AssessmentSection.name)
    private assessmentSectionModel: Model<AssessmentSectionDocument>,
  ) {}

  async create(
    createAssessmentSectionDto: CreateAssessmentSectionDto,
  ): Promise<AssessmentSection> {
    try {
      const assessmentSectionDoc = new this.assessmentSectionModel(
        createAssessmentSectionDto,
      );
      const assessmentSection = await assessmentSectionDoc.save();
      return assessmentSection.toObject();
    } catch (error) {
      if (error.code === 11000) {
        console.error('Duplicate key error:', error.message);
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<AssessmentSection[]> {
    const assessmentSections = await this.assessmentSectionModel
      .find()
      .lean();
    return assessmentSections;
  }

  async findOne(id: string): Promise<AssessmentSection> {
    const assessmentSection = await this.assessmentSectionModel
      .findById(id)
      .lean();
    if (!assessmentSection) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return assessmentSection;
  }

  async findByActivityId(
    assessmentSectionId: string,
  ): Promise<AssessmentSection> {
    const assessmentSection = await this.assessmentSectionModel
      .findById(assessmentSectionId)
      .lean();
    if (!assessmentSection) {
      throw new NotFoundException(
        `AssessmentSection with ID ${assessmentSectionId} not found`,
      );
    }
    return assessmentSection;
  }

  async update(
    id: string,
    updateAssessmentSectionDto: UpdateAssessmentSectionDto,
  ): Promise<AssessmentSection> {
    try {
      const exists = await this.assessmentSectionModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const options = { new: true };
      const assessmentSection = await this.assessmentSectionModel
        .findByIdAndUpdate(id, updateAssessmentSectionDto, options)
        .lean();
      return assessmentSection;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.update,
          }),
        );
      }

      throw error;
    }
  }

  async remove(id: string): Promise<AssessmentSection> {
    const assessmentSection = await this.assessmentSectionModel
      .findByIdAndDelete(id)
      .lean();
    if (!assessmentSection) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return assessmentSection;
  }
}
