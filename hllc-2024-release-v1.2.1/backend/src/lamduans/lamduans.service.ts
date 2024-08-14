import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLamduanDto } from './dto/create-lamduan.dto';
import { UpdateLamduanDto } from './dto/update-lamduan.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { Lamduan } from './schemas/lamduan.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CheckInsService } from 'src/check-ins/check-ins.service';
import { ActivitiesService } from 'src/activities/activities.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RecipientType } from 'src/notifications/enums/notificaton-target.enum';

@Injectable()
export class LamduansService {
  private readonly errorBuilder = new ErrorBuilder('Lamduan', 'Lamduans');

  constructor(
    @InjectModel(Lamduan.name)
    private lamduanModel: Model<Lamduan>,
    private readonly checkinsService: CheckInsService,
    private readonly activitiesService: ActivitiesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createLamduanDto: CreateLamduanDto): Promise<Lamduan> {
    try {
      const lamduanDoc = new this.lamduanModel(createLamduanDto);
      const lamduan = await lamduanDoc.save();
      return lamduan.toObject();
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

  async findAll(): Promise<Lamduan[]> {
    const lamduan = await this.lamduanModel.find().populate('user').lean();
    return lamduan;
  }

  async findOne(id: string): Promise<Lamduan> {
    try {
      const lamduan = await this.lamduanModel
        .findById(id)
        .populate('user')
        .lean();
      if (!lamduan) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return lamduan;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateLamduanDto: UpdateLamduanDto,
  ): Promise<Lamduan> {
    try {
      const exists = await this.lamduanModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      const options = { new: true };
      const lamduan = await this.lamduanModel
        .findByIdAndUpdate(id, updateLamduanDto, options)
        .lean();
      return lamduan;
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

  async remove(id: string): Promise<Lamduan> {
    try {
      const lamduan = await this.lamduanModel.findByIdAndDelete(id).lean();
      if (!lamduan) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return lamduan;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Lamduan> {
    const lamduan = await this.lamduanModel.findOne({ user: userId }).lean();
    if (!lamduan) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id: userId }),
      );
    }

    const activity = await this.activitiesService.findByCode('LAMDUAN');
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    try {
      console.log({ userId, activity });

      const existingCheckIn =
        await this.checkinsService.findOneByUserAndActivity(
          userId,
          activity._id.toString(),
        );
      if (!existingCheckIn) {
        const createCheckIn = {
          user: userId,
          activity: activity._id.toString(),
          staff: '66a1140c6a509d515e55cc75',
        };
        await this.checkinsService.create(createCheckIn);
        // Create notification
        await this.notificationsService.create({
          title: {
            th: 'ส่งดอกลำดวนเสร็จสิ้น',
            en: 'You have been submitted Lamduan flower',
          },
          subtitle: { th: 'พับดอกลำดวน', en: 'Lamduan Origami' },
          detail: {
            th: `คุณได้ส่งดอกลำดวนเสร็จสิ้น`,
            en: `You have been submitted your Lamduan flower`,
          },
          icon: 'mdi-check-circle',
          image: lamduan.lamduanImage,
          recipients: [{ type: RecipientType.individual, id: userId }],
          redirect: {
            btnMessage: {
              th: 'ดู',
              en: 'see',
            },
            url: `/lamduan`,
          },
        });
      }
    } catch (error) {
      console.error('Error while checking check-in:', error.message);
    }
    return lamduan;
  }
}
