import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { SponsorEntity } from './entities/sponsor.entity';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { ResponseDto } from 'src/app/common/dto/response.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/app/config/storage.config';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Sponsor } from './schemas/sponsors.schema';

const UPLOAD_FIELDS = [{ name: 'logo', maxCount: 1 }];

const logoUploadInterCepters = FileFieldsInterceptor(UPLOAD_FIELDS, {
  storage: storageConfig,
});

type UploadedImage = { logo?: Express.Multer.File[] };

@Controller('sponsors')
export class SponsorsController {
  private readonly messageBuilder = new MessageBuilder('Sponsor');

  constructor(private readonly sponsorService: SponsorsService) {}

  @Post()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Sponsor)
  @UseInterceptors(logoUploadInterCepters)
  async create(
    @Body() createSponsorDto: CreateSponsorDto,
    @UploadedFiles() files?: UploadedImage,
  ): Promise<ResponseDto<any>> {
    const logo = files?.logo?.[0].filename;
    const sponsor = await this.sponsorService.create({
      ...createSponsorDto,
      logo,
    });

    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new SponsorEntity(sponsor),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Sponsor)
  @Get()
  async findAll() {
    const sponsors = await this.sponsorService.findAll();
    const sponsorEntities = sponsors.map(
      (sponsor) => new SponsorEntity(sponsor),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      sponsorEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Sponsor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sponsor = await this.sponsorService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new SponsorEntity(sponsor),
    );
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Sponsor)
  @UseInterceptors(logoUploadInterCepters)
  async update(
    @Param('id') id: string,
    @Body() updateSponsorDto: UpdateSponsorDto,
    @UploadedFiles() files?: UploadedImage,
  ): Promise<any> {
    let logo = null;
    if (files?.logo) {
      logo = files?.logo?.[0].filename;
    } else {
      const sponsor = await this.sponsorService.findOne(id);
      logo = sponsor.logo;
    }
    const dtoWithPhoto = { ...updateSponsorDto, logo };
    const sponsor = await this.sponsorService.update(id, dtoWithPhoto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new SponsorEntity(sponsor),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Sponsor)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    const sponsor = await this.sponsorService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new SponsorEntity(sponsor),
    );
  }
}
