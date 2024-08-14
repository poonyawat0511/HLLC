import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  ParseFilePipeBuilder,
  UploadedFile,
  Req,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { LamduansService } from './lamduans.service';
import { CreateLamduanDto } from './dto/create-lamduan.dto';
import { UpdateLamduanDto } from './dto/update-lamduan.dto';
import { storageConfig } from 'src/app/config/storage.config';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { LamduanEntity } from './entities/lamduan.entity';
import { ResponseDto } from 'src/app/common/dto/response.dto';
import { ActivitiesService } from 'src/activities/activities.service';
import { CheckInsService } from 'src/check-ins/check-ins.service';
import { EvaluationsService } from 'src/evaluations/evaluations.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RecipientType } from 'src/notifications/enums/notificaton-target.enum';

const lamduanImageUploadInterCepters = FileInterceptor('lamduanImage', {
  storage: storageConfig,
});
@Controller('lamduans')
export class LamduansController {
  private readonly messageBuilder = new MessageBuilder('Lamduan');

  constructor(
    private readonly lamduansService: LamduansService,
    private readonly activityService: ActivitiesService,
    private readonly checkInsService: CheckInsService,
    private readonly evaluationsService: EvaluationsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor, lamduanImageUploadInterCepters)
  @Post()
  async create(
    @Body() createLamduanDto: CreateLamduanDto,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpeg|png' })
        .addMaxSizeValidator({ maxSize: 255 * 1024 }) // 255 KB limit
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<ResponseDto<any>> {
    const lamduanImage = file?.filename;

    // Create the lamduan
    const lamduan = await this.lamduansService.create({
      ...createLamduanDto,
      lamduanImage,
    });

    const activity = await this.activityService.findByCode('LAMDUAN');
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    try {
      const existingCheckIn =
        await this.checkInsService.findOneByUserAndActivity(
          req['user'].id,
          activity._id.toString(),
        );
      if (!existingCheckIn) {
        const createCheckIn = {
          user: req['user'].id,
          activity: activity._id.toString(),
          staff: '66a1140c6a509d515e55cc75',
        };
        await this.checkInsService.create(createCheckIn);
      }
    } catch (error) {
      console.error('Error while checking check-in:', error.message);
    }

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
      image: lamduanImage,
      recipients: [
        { type: RecipientType.individual, id: createLamduanDto.user },
      ],
      redirect: {
        btnMessage: {
          th: 'ดู',
          en: 'see',
        },
        url: `/lamduan`,
      },
    });

    // Return the response
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new LamduanEntity(lamduan),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const lamduans = await this.lamduansService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      lamduans.map((lamduan) => new LamduanEntity(lamduan)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const lamduan = await this.lamduansService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new LamduanEntity(lamduan),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor, lamduanImageUploadInterCepters)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLamduanDto: UpdateLamduanDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpeg|png' })
        .addMaxSizeValidator({ maxSize: 255 * 1024 }) // 255 KB limit
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    const lamduanImage = file?.filename;
    const dtoWithPhoto = { ...updateLamduanDto, lamduanImage };
    const lamduan = await this.lamduansService.update(id, dtoWithPhoto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new LamduanEntity(lamduan),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string, @Query('reason') reason: string) {
    try {
      // find lamduan by id
      const lamduanDoc = await this.lamduansService.findOne(id);
      if (!lamduanDoc) {
        throw new NotFoundException(`Lamduan with id ${id} not found`);
      }

      // find activity by code
      const activity = await this.activityService.findByCode('LAMDUAN');
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      try {
        // find check in id by user id and activity id
        const checkIn = await this.checkInsService.findOneByUserAndActivity(
          lamduanDoc.user._id.toString(),
          activity._id.toString(),
        );
        if (checkIn) {
          // delete check in user
          await this.checkInsService.remove(checkIn._id);
        }
      } catch (error) {
        console.error('Error while removing check-in:', error.message);
      }

      try {
        // find evaluation by user id and activity id
        const evaluation =
          await this.evaluationsService.findByUserIdAndActivityId(
            lamduanDoc.user._id.toString(),
            activity._id.toString(),
          );
        if (evaluation) {
          // delete evaluation
          await this.evaluationsService.remove(evaluation._id);
        }
      } catch (error) {
        console.error('Error while removing evaluation:', error.message);
      }

      // remove lamduan
      await this.lamduansService.remove(id);

      const message = (() => {
        switch (reason) {
          case 'edit':
            return {
              th: 'เกิดข้อขัดข้องของระบบ',
              en: 'the system is in trouble',
            };
          default:
            return { th: 'รูปภาพไม่ถูกต้องหรือตรงตามเงื่อนไข', en: '' };
        }
      })();

      // Create notification
      await this.notificationsService.create({
        title: {
          th: 'ดอกลำดวนของคุณถูกลบ!',
          en: 'You lamduan flower has been deleted!',
        },
        subtitle: { th: 'พับดอกลำดวน', en: 'Lamduan Origami' },
        detail: {
          th: `ดอกลำดวนของคุณถูกลบเนื่องจาก${message.th} กรุณาอัพโหลดและทำแบบประเมินใหม่อีกครั้ง`,
          en: `You Lamduan flower has been deleted from the system because ${message.en}. Please resumit it again.`,
        },
        icon: 'mdi-delete-alert',
        image: activity.icon,
        recipients: [
          {
            type: RecipientType.individual,
            id: lamduanDoc.user._id.toString(),
          },
        ],
        redirect: {
          btnMessage: {
            th: 'ดู',
            en: 'see',
          },
          url: `/lamduan`,
        },
      });

      return createResponse(
        HttpStatus.OK,
        this.messageBuilder.build(ResponseMethod.remove, { id }),
        new LamduanEntity(lamduanDoc),
      );
    } catch (error) {
      // Handle specific known errors
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Log the error and rethrow a generic error
      console.error('Error while removing lamduan:', error.message);
      throw new Error('An error occurred while removing the lamduan');
    }
  }
}
