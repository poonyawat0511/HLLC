import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  ClassSerializerInterceptor,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { ResponseDto } from 'src/app/common/dto/response.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/app/config/storage.config';
import { SchoolEntity } from './entities/school.entity';
import { MajorEntity } from 'src/majors/entities/major.entity';
import SchoolInterface from './interfaces/school.interface';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { School } from './schemas/school.schema';
import { ThemeEntity } from 'src/themes/entities/theme.entity';

type PhotoUploadFields =
  | 'photos[first]'
  | 'photos[second]'
  | 'photos[third]'
  | 'photos[fourth]';

type UploadedPhotos = { [K in PhotoUploadFields]?: Express.Multer.File[] };

type UploadOptins = { name: PhotoUploadFields; maxCount: number };

const UPLOAD_FIELDS: UploadOptins[] = [
  { name: 'photos[first]', maxCount: 1 },
  { name: 'photos[second]', maxCount: 1 },
  { name: 'photos[third]', maxCount: 1 },
  { name: 'photos[fourth]', maxCount: 1 },
];

const PhotosUploadInterCepters = FileFieldsInterceptor(UPLOAD_FIELDS, {
  storage: storageConfig,
});

/**
 * A function to transform file into photos object
 * @param files multer file upload
 * @returns photos object
 */
function getPhotosFromFiles(files: UploadedPhotos, clean?: boolean) {
  const photos = {
    first: files['photos[first]']?.[0]?.filename ?? null,
    second: files['photos[second]']?.[0]?.filename ?? null,
    third: files['photos[third]']?.[0]?.filename ?? null,
    fourth: files['photos[fourth]']?.[0]?.filename ?? null,
  };
  if (!clean) return photos as SchoolInterface['photos'];
  return Object.fromEntries(
    Object.entries(photos).filter(([, v]) => v !== null),
  ) as SchoolInterface['photos'];
}

@Controller('schools')
export class SchoolsController {
  private readonly messageBuilder = new MessageBuilder('School');

  constructor(private readonly schoolService: SchoolsService) {}

  @UseInterceptors(ClassSerializerInterceptor, PhotosUploadInterCepters)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, School)
  @Post()
  async create(
    @UploadedFiles() files: UploadedPhotos,
    @Body() createSchoolDto: CreateSchoolDto,
    @Query('includes') includes?: string | string[],
  ) {
    const photos = getPhotosFromFiles(files);
    const school = await this.schoolService.create(
      {
        ...createSchoolDto,
        photos,
      },
      { includes },
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new SchoolEntity(school),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, School)
  @Get()
  async findAll(@Query('includes') includes?: string | string[]) {
    const schools = await this.schoolService.findAll({ includes });
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      schools.map((school) => new SchoolEntity(school)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, School)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('includes') includes?: string | string[],
  ) {
    const school = await this.schoolService.findOne(id, { includes });
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new SchoolEntity(school),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, School)
  @Get(':id/majors')
  async findSchoolMajors(@Param('id') id: string) {
    const majors = await this.schoolService.findSchoolMajors(id);
    return createResponse(
      HttpStatus.OK,
      `Find all majors by school id ${id} successfully`,
      majors.map((major) => new MajorEntity(major)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, School)
  @Get(':id/theme')
  async findColor(@Param('id') id: string) {
    const theme = await this.schoolService.findSchoolTheme(id);
    return createResponse(
      HttpStatus.OK,
      `Find theme by school id ${id} successfully`,
      new ThemeEntity(theme),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor, PhotosUploadInterCepters)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, School)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: UploadedPhotos,
    @Body() updateSchoolDto: UpdateSchoolDto,
    @Query('includes') includes?: string | string[],
  ): Promise<ResponseDto<any>> {
    const existingSchool = await this.schoolService.findOne(id, { includes });
    if (updateSchoolDto.name === undefined) {
      updateSchoolDto.name = existingSchool.name;
    }
    if (updateSchoolDto.acronym === undefined) {
      updateSchoolDto.acronym = existingSchool.acronym;
    }
    if (updateSchoolDto.detail === undefined) {
      updateSchoolDto.detail = existingSchool.detail;
    }
    if (files) {
      const photos = getPhotosFromFiles(files);
      updateSchoolDto.photos = {
        first: photos.first || existingSchool.photos.first,
        second: photos.second || existingSchool.photos.second,
        third: photos.third || existingSchool.photos.third,
        fourth: photos.fourth || existingSchool.photos.fourth,
      };
    }
    if (updateSchoolDto.photos === undefined) {
      updateSchoolDto.photos = existingSchool.photos;
    }
    const school = await this.schoolService.update(id, updateSchoolDto, {
      includes,
    });
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new SchoolEntity(school),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, School)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseDto<any>> {
    const deletedSchool = await this.schoolService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new SchoolEntity(deletedSchool),
    );
  }
}
