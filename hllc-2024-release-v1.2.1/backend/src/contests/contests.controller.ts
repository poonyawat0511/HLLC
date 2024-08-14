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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContestsService } from './contests.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResponseDto } from 'src/app/common/dto/response.dto';
import { storageConfig } from 'src/app/config/storage.config';
import { ContestEntity } from './entities/contest.entity';
import { ContestVoteEntity } from './entities/contest-vote.entity';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Contest } from './schemas/contest.schema';

const UPLOAD_FIELDS = [{ name: 'coverImage', maxCount: 1 }];

const CoverImageUploadInterCepters = FileFieldsInterceptor(UPLOAD_FIELDS, {
  storage: storageConfig,
});

type UploadedImage = { coverImage?: Express.Multer.File[] };

@Controller('contests')
export class ContestsController {
  private readonly messageBuilder = new MessageBuilder('Contest');

  constructor(private readonly contestsService: ContestsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Contest)
  @Get('vote')
  async findUserRecentVote(@Req() req: Request) {
    const vote = await this.contestsService.findUserRecentVote(req['user'].id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      new ContestVoteEntity(vote),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('vote')
  async voteContent(@Req() req: Request, @Body('contestId') contestId: string) {
    const vote = await this.contestsService.voteContent(
      contestId,
      req['user'].id,
    );
    return createResponse(
      HttpStatus.CREATED,
      `Voted contest id ${contestId} successfully`,
      new ContestVoteEntity(vote),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('vote')
  async unvoteContent(@Req() req: Request) {
    const vote = await this.contestsService.unvoteContent(req['user'].id);
    return createResponse(
      HttpStatus.OK,
      'Unvoted contest successfully',
      new ContestVoteEntity(vote),
    );
  }

  @UseInterceptors(CoverImageUploadInterCepters)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Contest)
  @Post()
  async create(
    @Body() createContestDto: CreateContestDto,
    @UploadedFiles() files?: UploadedImage,
  ): Promise<ResponseDto<any>> {
    const coverImage = files?.coverImage?.[0].filename;
    const contest = await this.contestsService.create({
      ...createContestDto,
      coverImage,
    });
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new ContestEntity(contest),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Contest)
  @Get()
  async findAll() {
    const contests = await this.contestsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      contests.map((contest) => new ContestEntity(contest)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Contest)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contest = await this.contestsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new ContestEntity(contest),
    );
  }

  @UseInterceptors(CoverImageUploadInterCepters)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Contest)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContestDto: UpdateContestDto,
    @UploadedFiles() files?: UploadedImage,
  ): Promise<any> {
    const coverImage = files?.coverImage?.[0].filename;
    const dtoWithPhoto = { ...updateContestDto, coverImage };
    const contest = await this.contestsService.update(id, dtoWithPhoto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new ContestEntity(contest),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Contest)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const contest = await this.contestsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new ContestEntity(contest),
    );
  }
}
