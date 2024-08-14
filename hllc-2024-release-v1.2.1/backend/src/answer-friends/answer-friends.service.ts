import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAnswerQueDto } from './dto/create-answer-friend.dto';
import {
  AnswerQues,
} from './schemas/answer-friends.schemas';
import { User } from 'src/users/schemas/user.schema';
import { AnswerFriendsGateway } from './answer-friens.gateway';

@Injectable()
export class AnswerFriendsService {
  private answerFriendsGateway: AnswerFriendsGateway;
  private readonly errorBuilder = new ErrorBuilder('AnswerQues');

  constructor(
    @InjectModel(AnswerQues.name)
    private answerQuesModel: Model<AnswerQues>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  setGateway(gateway: AnswerFriendsGateway) {
    this.answerFriendsGateway = gateway;
  }

  async create(createAnswerQueDto: CreateAnswerQueDto): Promise<AnswerQues> {
    try {
      const answerQueDoc = new this.answerQuesModel(createAnswerQueDto);
      const answerQue = await answerQueDoc.save();
      const answerQueObj = answerQue.toObject();

      this.answerFriendsGateway.emitAnswerRequest(answerQueObj); 

      return answerQueObj;
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

  async findAll(): Promise<AnswerQues[]> {
    const answerQue = await this.answerQuesModel.find().lean();
    return answerQue;
  }

  async findOne(id: string): Promise<AnswerQues> {
    try {
      const answerQue = await this.answerQuesModel.findById(id).lean();
      if (!answerQue) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return answerQue;
    } catch (error) {
      throw error;
    }
  }

  async fineByStudentId(id: string): Promise<AnswerQues[]> {
    try {
      const answerQues = await this.answerQuesModel
        .find({ receiver: id })
        .populate('sender')
        .populate('receiver')
        .populate('questions.questionnaire')
        .lean();

      return answerQues;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateAnswerQueDto: CreateAnswerQueDto) {
    try {
      const exists = await this.answerQuesModel.exists({ _id: id });

      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }

      const answer = await this.answerQuesModel
        .findByIdAndUpdate(id, updateAnswerQueDto, { new: true })
        .lean();
      return answer;
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

  async remove(id: string): Promise<AnswerQues> {
    const answer = await this.answerQuesModel.findByIdAndDelete(id).lean();
    if (!answer) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return answer;
  }

  async getUserMeta(id: string) {
    const user: User = await this.userModel
      .findById(id)
      .lean();
    if (!user) return null;
    return {
      id: user._id.toString(),
    };
  }
}
