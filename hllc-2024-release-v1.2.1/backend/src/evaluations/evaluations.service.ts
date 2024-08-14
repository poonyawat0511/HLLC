import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { InjectModel } from '@nestjs/mongoose';
import { Evaluation } from './schemas/evaluation.schema';
import { Model } from 'mongoose';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Activity } from 'src/activities/schemas/activities.schema';
import { RecipientType } from 'src/notifications/enums/notificaton-target.enum';
import { Evolution } from 'src/evolutions/schemas/evolution.schema';
import { Item } from 'src/items/schemas/item.schema';

@Injectable()
export class EvaluationsService {
  private readonly errorBuilder = new ErrorBuilder('evaluation');

  constructor(
    @InjectModel(Evaluation.name)
    private evaluationModel: Model<Evaluation>,
    @InjectModel(Evolution.name)
    private readonly evolutionModel: Model<Evolution>,
    @InjectModel(Item.name)
    private readonly itemModel: Model<Item>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createEvaluationDto: CreateEvaluationDto): Promise<Evaluation> {
    try {
      const evaluationDoc = new this.evaluationModel(createEvaluationDto);
      const evaluation = await evaluationDoc.save();
      await evaluation.populate('activity');
      const evaluationObj = evaluation.toObject();

      // Create notification
      const activity = evaluationObj.activity as Activity;
      await this.notificationsService.create({
        title: {
          th: 'ทำแบบประเมินกิจกรรมเสร็จสิ้น',
          en: 'Submit activity assessment successfully',
        },
        subtitle: { th: activity.name.th, en: activity.name.en },
        detail: {
          th: `ทำแบบประเมินกิจกรรม ${activity.name.th} เรียบร้อย`,
          en: `You have been submit assessment of activity ${activity.name.en}`,
        },
        icon: 'mdi-check-circle',
        image: activity.icon,
        recipients: [
          { type: RecipientType.individual, id: createEvaluationDto.author },
        ],
        redirect: {
          btnMessage: {
            th: 'ดู',
            en: 'see',
          },
          url:
            activity.code === 'LAMDUAN'
              ? '/lamduan'
              : activity.code === 'KHANTOKE'
                ? '/khantoke'
                : `/activities/${activity._id.toString()}`,
        },
      });

      return evaluationObj;
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

  async findAll(): Promise<Evaluation[]> {
    const evaluation = await this.evaluationModel.find().lean();
    return evaluation;
  }

  async findOne(id: string): Promise<Evaluation> {
    try {
      const evaluation = await this.evaluationModel.findById(id).lean();
      if (!evaluation) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return evaluation;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Evaluation[]> {
    try {
      const evaluations = await this.evaluationModel
        .find({ author: userId })
        .populate('activity')
        .lean();
      return evaluations;
    } catch (error) {
      throw error;
    }
  }

  async findByUserIdAndActivityId(
    userId: string,
    activityId: string,
  ): Promise<any> {
    try {
      const evaluation = await this.evaluationModel
        .findOne({
          author: userId,
          activity: activityId,
        })
        .lean();
      return evaluation;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateEvaluationDto: UpdateEvaluationDto,
  ): Promise<Evaluation> {
    try {
      const exists = await this.evaluationModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const options = { new: true };
      const evaluation = await this.evaluationModel
        .findByIdAndUpdate(id, updateEvaluationDto, options)
        .lean();
      return evaluation;
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

  async removeItem(evaluation: Evaluation) {
    try {
      const item = await this.itemModel
        .findOne({
          activity: evaluation.activity._id.toString(),
        })
        .lean();
      if (!item) return;
      const deleteOption = await this.evolutionModel.deleteOne({
        user: evaluation.author,
        item: item._id,
      });
      if (deleteOption.deletedCount < 1) return;
      const activity = evaluation.activity as Activity;
      await this.notificationsService.create({
        title: { th: 'ไอเทมถูกลบ', en: `Item is deleted` },
        subtitle: { th: activity.name.th, en: activity.name.en },
        detail: {
          th: `ไอเทมของคุณถูกลบเนื่องจากมีการลบแบบประเมินกิจกรรม "${activity.name.th}" ของคุณ`,
          en: `Your item is deleted from the system because the evaluation of the activity "${activity.name.en}" is deleted`,
        },
        icon: 'mdi-delete-alert',
        image: item.image,
        recipients: [
          {
            type: RecipientType.individual,
            id: evaluation.author.toString(),
          },
        ],
        redirect: {
          url:
            activity.code === 'LAMDUAN'
              ? '/lamduan'
              : activity.code === 'KHANTOKE'
                ? '/khantoke'
                : `/activities/${activity._id.toString()}`,
          btnMessage: {
            th: 'ตรวจสอบ',
            en: 'Check out',
          },
        },
      });
    } catch (error) {
      console.error('Error deleting evolution item', error);
    }
  }

  async remove(id: string): Promise<Evaluation> {
    try {
      const evaluation = await this.evaluationModel
        .findByIdAndDelete(id)
        .populate('activity')
        .lean();
      if (!evaluation) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }

      await (async () => {
        try {
          const activity = evaluation.activity as Activity;
          await this.notificationsService.create({
            title: {
              th: 'แบบประเมินกิจกรรมถูกลบ',
              en: `Activity evaluation is deleted`,
            },
            subtitle: { th: activity.name.th, en: activity.name.en },
            detail: {
              th: `แบบประเมินกิจกรรม "${activity.name.th}" ถูกลบออกจากระบบ กรุณาทำแบบประเมินใหม่อีกครั้ง`,
              en: `Your evaluation of the activity "${activity.name.en}" is deleted. Please try to resubmit it again`,
            },
            icon: 'mdi-delete-alert',
            image: activity.icon,
            recipients: [
              {
                type: RecipientType.individual,
                id: evaluation.author.toString(),
              },
            ],
            redirect: {
              url:
                activity.code === 'LAMDUAN'
                  ? '/lamduan'
                  : activity.code === 'KHANTOKE'
                    ? '/khantoke'
                    : `/activities/${activity._id.toString()}`,
              btnMessage: {
                th: 'ตรวจสอบ',
                en: 'Check out',
              },
            },
          });
        } catch (error) {
          console.error(
            'Error while push notification on delete evalutaioin',
            error,
          );
        }
      })();

      // Delete activity
      await this.removeItem(evaluation);

      return evaluation;
    } catch (error) {
      throw error;
    }
  }
}
