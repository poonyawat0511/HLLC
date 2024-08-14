import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuestionsService {
  private readonly errorBuilder = new ErrorBuilder('Question', 'Questions');

  constructor(
    @InjectModel(Question.name)
    private questionModel: Model<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    try {
      const questionDoc = new this.questionModel(createQuestionDto);
      const question = await questionDoc.save();
      return question.toObject();
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

  async findAll(): Promise<Question[]> {
    const questions = await this.questionModel.find().lean();
    return questions;
  }

  async findOne(id: string): Promise<Question> {
    try {
      const question = await this.questionModel.findById(id).lean();
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

  async findByActivityId(id: string): Promise<Question[]> {
    const questions = await this.questionModel
      .find({ activity: id })
      .lean()
      .exec();
    if (!questions) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return questions;
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const exists = await this.questionModel.exists({ _id: id });

    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }

    const question = await this.questionModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .lean();

    return question;
  }

  async remove(id: string): Promise<Question> {
    const question = await this.questionModel.findByIdAndDelete(id).lean();
    if (!question) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return question;
  }
}
