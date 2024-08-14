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
  UseGuards,
} from '@nestjs/common';
import { PosttestsService } from './posttests.service';
import { CreatePosttestDto } from './dto/create-posttest.dto';
import { UpdatePosttestDto } from './dto/update-posttest.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { PosttestEntity } from './entities/posttest.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AssessmentsService } from 'src/assessments/assessments.service';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Posttest } from './schemas/posttest.schema';
import { AssessmentEntity } from 'src/assessments/entities/assessment.entity';

@Controller('posttests')
export class PosttestsController {
  private readonly messageBuilder = new MessageBuilder(
    'Answer Assessment',
    'Answer Assessments',
  );
  constructor(
    private readonly posttestsService: PosttestsService,
    private readonly userService: UsersService,
    private readonly assessmentsService: AssessmentsService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Posttest)
  @Post()
  async create(@Body() createPosttestDto: CreatePosttestDto): Promise<any> {
    const posttest = await this.posttestsService.create(createPosttestDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new PosttestEntity(posttest),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Posttest)
  @Get()
  async findAll() {
    const posttests = await this.posttestsService.findAll();
    const posttestEntity = posttests.map(
      (posttest) => new PosttestEntity(posttest),
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      posttestEntity,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Posttest)
  @Get(':id/findone')
  async findOne(@Param('id') id: string): Promise<any> {
    const posttest = await this.posttestsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new PosttestEntity(posttest),
    );
  }

  // user detail by id
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Posttest)
  @Get(':id/includeduserinfo')
  async findOneWithUserInfo(@Param('id') id: string) {
    const posttest = await this.posttestsService.findOne(id.toString());
    const author = await this.userService.findOne(posttest.author.toString());

    const posttestWithUserInfo = {
      ...posttest,
      authors: new UserEntity(author),
    };

    const posttestEntity = new PosttestEntity(posttestWithUserInfo);

    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      posttestEntity,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Posttest)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePosttestDto: UpdatePosttestDto,
  ): Promise<any> {
    const posttest = await this.posttestsService.update(id, updatePosttestDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new PosttestEntity(posttest),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Posttest)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    const posttest = await this.posttestsService.remove(id);

    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new PosttestEntity(posttest),
    );
  }
}
