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
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { EvolutionsService } from './evolutions.service';
import { EvolutionEntity } from './entities/evolution.entity';
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Evolution } from './schemas/evolution.schema';
import { userAccessGuard } from 'src/app/guards/owner.guard';
import { Roles } from 'src/auth/enums/roles.enum';

@Controller('evolutions')
export class EvolutionsController {
  private readonly messageBuilder = new MessageBuilder('Evolution');

  constructor(private readonly evolutionsService: EvolutionsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(
    AccessGuard,
    userAccessGuard({ location: 'body', field: 'user', role: Roles.USER }),
  )
  @UseAbility(Actions.create, Evolution)
  @Post()
  async create(@Body() createEvolutionDto: CreateEvolutionDto) {
    const evolution = await this.evolutionsService.create(createEvolutionDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new EvolutionEntity(evolution),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Evolution)
  @Get()
  async findAll() {
    const evolutions = await this.evolutionsService.findAll();
    const evolutionEntities = evolutions.map(
      (evolution) => new EvolutionEntity(evolution),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      evolutionEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Evolution)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const evolution = await this.evolutionsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new EvolutionEntity(evolution),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Evolution, [
    EvolutionsService,
    (service: EvolutionsService, { params }) =>
      service.findOne(params.input.id),
  ])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEvolutionDto: UpdateEvolutionDto,
  ) {
    const evolution = await this.evolutionsService.update(
      id,
      updateEvolutionDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new EvolutionEntity(evolution),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Evolution)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    const evolution = await this.evolutionsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new EvolutionEntity(evolution),
    );
  }
}
