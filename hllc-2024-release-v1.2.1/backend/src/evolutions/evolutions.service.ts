import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Evolution } from './schemas/evolution.schema';
import { Model } from 'mongoose';
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { User } from 'src/users/schemas/user.schema';
import { Item } from 'src/items/schemas/item.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Evaluation } from 'src/evaluations/schemas/evaluation.schema';
import { Activity } from 'src/activities/schemas/activities.schema';
import { RecipientType } from 'src/notifications/enums/notificaton-target.enum';

@Injectable()
export class EvolutionsService {
  private readonly errorBuilder = new ErrorBuilder('Evolution');

  constructor(
    @InjectModel(Evolution.name) private evolutionModel: Model<Evolution>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(Evaluation.name) private evaluationModel: Model<Evaluation>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createEvolutionDto: CreateEvolutionDto): Promise<Evolution> {
    try {
      const user = await this.userModel.exists({
        _id: createEvolutionDto.user,
      });

      if (!user) {
        throw new NotFoundException(`User is invalid`);
      }

      const item = (await this.itemModel
        .findById(createEvolutionDto.item)
        .populate('activity')
        .lean()) as Item & { activity: Activity };
      if (!item) {
        throw new NotFoundException('Item is invalid');
      }

      const assessment = await this.evaluationModel.exists({
        activity: item.activity?._id,
        author: user._id,
      });

      if (!assessment) {
        throw new BadRequestException(
          `Cannot create item of activity with no assessment`,
        );
      }

      const evolutionDoc = new this.evolutionModel(createEvolutionDto);
      const evolution = await evolutionDoc.save();
      const evolutionObj = evolution.toObject();

      // Create notification
      await this.notificationsService.create({
        title: {
          th: 'ได้รับไอเทมใหม่!',
          en: 'Received new item!',
        },
        subtitle: { th: item.name.th, en: item.name.en },
        detail: {
          th: `ได้รับไอเทมใหม่จากการทำแบบประเมินกิจกรรม "${item.activity.name.th}"`,
          en: `You have been recieved a new item after submit assessment of activity ${item.activity.name.en}`,
        },
        icon: 'mdi-check-circle',
        image: item.image,
        recipients: [
          { type: RecipientType.individual, id: createEvolutionDto.user },
        ],
        redirect: {
          btnMessage: {
            th: 'Evolve',
            en: 'Evolve',
          },
          url: `/evolution`,
        },
      });

      return evolutionObj;
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

  async findAll(): Promise<Evolution[]> {
    const evolutions = await this.evolutionModel.find().lean();
    return evolutions;
  }

  async findOne(id: string): Promise<Evolution> {
    try {
      const evolution = await this.evolutionModel.findById(id).lean();
      if (!evolution) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }
      return evolution;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateEvolutionDto: UpdateEvolutionDto,
  ): Promise<Evolution> {
    try {
      const evolution = await this.evolutionModel
        .findById(id)
        .select('isUsed')
        .lean();
      if (!evolution) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id }),
        );
      }

      if (evolution.isUsed) {
        throw new BadRequestException('This item can be used once');
      }

      const updatedData = await this.evolutionModel
        .findByIdAndUpdate(
          id,
          {
            isUsed: updateEvolutionDto.isUsed,
            useAt: Date.now(),
          },
          { new: true },
        )
        .lean();
      return updatedData;
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

  async remove(id: string): Promise<Evolution> {
    const evolution = await this.evolutionModel
      .findByIdAndDelete(id)
      .lean()
      .exec();
    if (!evolution) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return evolution;
  }
}
