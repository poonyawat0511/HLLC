import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { Model } from 'mongoose';
import { Questionnaire } from './schemas/questionnaire.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';

@Injectable()
export class QuestionnaireService {
  private readonly errorBuilder = new ErrorBuilder(
    'Questionnaire',
    'Questionnaires',
  );

  constructor(
    @InjectModel(Questionnaire.name)
    private questionnareModel: Model<Questionnaire>,
  ) {}
  async create(
    CreateQuestionnaireDto: CreateQuestionnaireDto,
  ): Promise<Questionnaire> {
    try {
      const questionDoc = new this.questionnareModel(CreateQuestionnaireDto);
      const question = await questionDoc.save();
      return question.toObject();
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

  async findAll(): Promise<Questionnaire[]> {
    const questions = await this.questionnareModel.find().lean();
    return questions;
  }

  async findOne(id: string): Promise<Questionnaire> {
    try {
      const question = await this.questionnareModel.findById(id).lean();
      if (!question) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return question;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionnaireDto,
  ): Promise<Questionnaire> {
    const exists = await this.questionnareModel.exists({ _id: id });

    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }

    const question = await this.questionnareModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .lean();

    return question;
  } 

  async remove(id: string): Promise<Questionnaire> {
    const question = await this.questionnareModel.findByIdAndDelete(id).lean();
    if (!question) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return question;
  }
}
