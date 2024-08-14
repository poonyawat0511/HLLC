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
  Query,
  UseGuards,
} from '@nestjs/common';
import { MajorsService } from './majors.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { MajorEntity } from './entities/major.entity';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Major } from './schemas/major.schema';

@Controller('majors')
export class MajorsController {
  private readonly messageBuilder = new MessageBuilder('Major');

  constructor(private readonly majorService: MajorsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Major)
  @Post()
  async create(
    @Body() createMajorDto: CreateMajorDto,
    @Query('includes') includes?: string | string[],
  ) {
    const major = await this.majorService.create(createMajorDto, { includes });
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new MajorEntity(major),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Major)
  @Get()
  async findAll(@Query('includes') includes?: string | string[]) {
    const majors = await this.majorService.findAll({ includes });
    const majorEntities = majors.map((major) => new MajorEntity(major));
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      majorEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(AccessGuard)
  // @UseAbility(Actions.read, Major)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('includes') includes?: string | string[],
  ) {
    const major = await this.majorService.findOne(id, { includes });
    const majorEntity = new MajorEntity(major);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      majorEntity,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Major)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMajorDto: UpdateMajorDto,
    @Query('includes') includes?: string | string[],
  ) {
    const major = await this.majorService.update(id, updateMajorDto, {
      includes,
    });
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new MajorEntity(major),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Major)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('includes') includes?: string | string[],
  ) {
    const major = await this.majorService.remove(id, { includes });
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new MajorEntity(major),
    );
  }
}
