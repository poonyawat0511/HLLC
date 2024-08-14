import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePosttestDto } from './dto/create-posttest.dto';
import { UpdatePosttestDto } from './dto/update-posttest.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Posttest } from './schemas/posttest.schema';
import { Model } from 'mongoose';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RecipientType } from 'src/notifications/enums/notificaton-target.enum';

const POPULATE_PIPE = [
  {
    path: 'author',
    select: ['username'],
  },
  {
    path: 'values.assessment',
    select: ['assessment', 'value'],
  },
];
@Injectable()
export class PosttestsService {
  private readonly errorBuilder = new ErrorBuilder('Answer', 'Answers');

  constructor(
    @InjectModel(Posttest.name)
    private posttestModel: Model<Posttest>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createPosttestDto: CreatePosttestDto): Promise<Posttest> {
    try {
      const posttestDoc = new this.posttestModel(createPosttestDto);
      const posttest = await posttestDoc.save();

      // Create notification
      await this.notificationsService.create({
        title: {
          th: 'คุณผ่านกิจกรรมแล้ว',
          en: 'You have completed the activity.',
        },
        subtitle: { th: 'ทำแบบประเมินเสร็จสิ้น', en: 'Completed the assessment' },
        detail: {
          th: `การแจ้งเตือนนี้เป็นการยืนว่าคุณผ่านกิจกรรม How to Live and Learn on Campus 2024 แล้ว เนื่องจากคุณได้ทำแบบประเมินหลังกิจกรรม How to Live and Learn on Campus 2024 เรียบร้อยแล้ว`,
          en: `This notification confirms that you have completed How to Live and Learn on Campus 2024 as you have completed the How to Live and Learn on Campus 2024 post-assessment.`,
        },
        icon: 'mdi-file-document-check',
        image: 'https://hllc.mfu.ac.th/logo-sdad.png',
        recipients: [
          { type: RecipientType.individual, id: createPosttestDto.author },
        ],
      });

      return posttest.toObject();
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

  async findAll(): Promise<Posttest[]> {
    const posttests = await this.posttestModel
      .find()
      .populate(POPULATE_PIPE)
      .lean();
    return posttests;
  }

  async findOne(id: string): Promise<Posttest> {
    try {
      const posttest = await this.posttestModel
        .findById(id)
        .populate(POPULATE_PIPE)
        .lean();
      if (!posttest) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return posttest;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePosttestDto: UpdatePosttestDto) {
    const exists = await this.posttestModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const posttest = await this.posttestModel
        .findByIdAndUpdate(id, updatePosttestDto, { new: true })
        .lean();
      return posttest;
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

  async remove(id: string): Promise<Posttest> {
    try {
      const posttest = await this.posttestModel.findByIdAndDelete(id).lean();
      if (!posttest) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return posttest;
    } catch (error) {
      throw error;
    }
  }
}
