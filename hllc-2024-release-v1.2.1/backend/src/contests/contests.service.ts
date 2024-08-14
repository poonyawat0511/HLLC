import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Contest } from './schemas/contest.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { ContestVote } from './schemas/contest-vote.schema';

@Injectable()
export class ContestsService {
  private readonly errorBuilder = new ErrorBuilder('Contest');

  constructor(
    @InjectModel(Contest.name) private ContestModel: Model<Contest>,
    @InjectModel(ContestVote.name) private contestVoteModel: Model<ContestVote>,
  ) {}

  async create(createContestDto: CreateContestDto): Promise<Contest> {
    try {
      const contestDoc = new this.ContestModel(createContestDto);
      const contest = await contestDoc.save();
      return contest.toObject();
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

  async findAll(): Promise<Contest[]> {
    try {
      const contests = await this.ContestModel.aggregate([
        {
          $lookup: {
            from: 'contestvotes',
            as: 'votes',
            localField: '_id',
            foreignField: 'current',
          },
        },
        {
          $set: {
            votes: { $size: '$votes' },
          },
        },
      ]);
      return contests;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Contest> {
    try {
      const contests = await this.ContestModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'contestvotes',
            as: 'votes',
            localField: '_id',
            foreignField: 'current',
          },
        },
        {
          $set: {
            votes: { $size: '$votes' },
          },
        },
      ]);
      if (!contests?.[0]) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return contests?.[0];
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateContestDto: UpdateContestDto,
  ): Promise<Contest | null> {
    try {
      const updatedContest = await this.ContestModel.findByIdAndUpdate(
        id,
        updateContestDto,
        { new: true },
      ).lean();
      if (!updatedContest) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return updatedContest;
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

  async remove(id: string): Promise<Contest> {
    const contest = await this.ContestModel.findByIdAndDelete(id).lean();
    if (!contest) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return contest;
  }

  async findUserRecentVote(userId: string): Promise<ContestVote> {
    try {
      const contestVote = await this.contestVoteModel
        .findOne({ author: userId })
        .select({ current: 1, author: 1, createdAt: 1, updatedAt: 1 })
        .populate('current')
        .lean();
      return contestVote ?? null;
    } catch (error) {
      throw error;
    }
  }

  async voteContent(contestId: string, authorId: string): Promise<ContestVote> {
    try {
      const existingVote = await this.contestVoteModel.exists({
        author: authorId,
      });
      if (!existingVote) {
        const newVote = new this.contestVoteModel({
          current: contestId,
          author: authorId,
          histories: [{ content: contestId }],
        });
        const savedVote = await newVote.save();
        await savedVote.populate('current');
        return savedVote.toObject();
      }
      const vote = await this.contestVoteModel
        .findByIdAndUpdate(existingVote._id, {
          current: contestId,
          $push: { histories: { content: contestId } },
        })
        .select({ author: 1, createdAt: 1, updatedAt: 1 })
        .lean();
      vote.current = await this.ContestModel.findById(contestId).lean();

      return vote;
    } catch (error) {
      throw error;
    }
  }

  async unvoteContent(authorId: string): Promise<ContestVote> {
    try {
      const contest = await this.contestVoteModel.findOne({
        author: authorId,
      });
      if (!contest) {
        throw new NotFoundException(`No vote of user ${authorId} found`);
      }
      if (contest.current) {
        contest.current = null;
        const updatedVote = await contest.save();
        return updatedVote.toObject();
      }
    } catch (error) {
      throw error;
    }
  }
}
