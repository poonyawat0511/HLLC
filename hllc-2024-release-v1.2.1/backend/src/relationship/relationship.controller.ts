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
  ClassSerializerInterceptor,

} from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { RelationshipEntity } from './entities/relationship.entity';

@Controller('relationship')
export class RelationshipController {
  private readonly messageBuilder = new MessageBuilder('relationship');

  constructor(private readonly relationshipService: RelationshipService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createRelationshipDto: CreateRelationshipDto) {
    const relationship = await this.relationshipService.create(
      createRelationshipDto,
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new RelationshipEntity(relationship),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<RelationshipEntity[]> {
    const relationships = await this.relationshipService.findAllWithFriendCounts();
    return relationships.map(rel => new RelationshipEntity(rel));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const relationship = await this.relationshipService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new RelationshipEntity(relationship),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('search/:userId')
  async fineByUserId(@Param('userId') id: string) {
    const relationship = await this.relationshipService.findByUserId(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      relationship.map((rela) => new RelationshipEntity(rela)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRelationshipDto: UpdateRelationshipDto,
  ) {
    const relationship = await this.relationshipService.update(
      id,
      updateRelationshipDto,
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new RelationshipEntity(relationship),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const relationship = await this.relationshipService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new RelationshipEntity(relationship),
    );
  }
}
