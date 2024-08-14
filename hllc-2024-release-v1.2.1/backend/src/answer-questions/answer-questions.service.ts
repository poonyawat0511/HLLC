import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateAnswerQuestionDto } from './dto/create-answer-question.dto';
import { UpdateAnswerQuestionDto } from './dto/update-answer-question.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { AnswerQuestion } from './schemas/answer-questions.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AnswerQuestionsService {
  private readonly errorBuilder = new ErrorBuilder('Sponsor');
  constructor(
    @InjectModel(AnswerQuestion.name)
    private readonly answerQuestionModel: Model<AnswerQuestion>,
  ) {}

  async create(
    createAnswerQuestionDto: CreateAnswerQuestionDto,
  ): Promise<AnswerQuestion> {
    try {
      const answerQuestionDoc = new this.answerQuestionModel(
        createAnswerQuestionDto,
      );
      const answerQuestion = await answerQuestionDoc.save();
      return answerQuestion.toObject();
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

  async findAll(): Promise<AnswerQuestion[]> {
    const answerQuestion = await this.answerQuestionModel
      .find()
      .populate({path: 'question', select: 'title'})
      .populate({path:'user',select: 'username'})
      .lean();
    return answerQuestion;
  }

  async findOne(id: string): Promise<AnswerQuestion> {
    const answerQuestion = await this.answerQuestionModel.findById(id).lean();
    if (!answerQuestion) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return answerQuestion;
  }

  async findAnswerByQuestionAndUser(
    userId: string,
    questionId: string,
  ): Promise<AnswerQuestion[]> {
    const answerQuestion = await this.answerQuestionModel
      .find({ user: userId, question: questionId })
      .lean();
    if (!answerQuestion) {
      throw new NotFoundException(`Answer question not have ${userId}`);
    }
    return answerQuestion;
  }

  async update(
    id: string,
    updateAnswerQuestionDto: UpdateAnswerQuestionDto,
  ): Promise<AnswerQuestion> {
    const exists = await this.answerQuestionModel.exists({ _id: id });
    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    const answerQuestion = await this.answerQuestionModel
      .findByIdAndUpdate(id, updateAnswerQuestionDto, { new: true })
      .lean();
    return answerQuestion;
  }

  async remove(id: string): Promise<AnswerQuestion> {
    const answerQuestion = await this.answerQuestionModel
      .findByIdAndDelete(id)
      .lean();
    if (!answerQuestion) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return answerQuestion;
  }
}
