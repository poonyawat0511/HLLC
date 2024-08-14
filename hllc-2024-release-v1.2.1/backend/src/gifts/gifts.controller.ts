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
} from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { GiftsEntity } from './entities/gift.entity';

@Controller('gifts')
export class GiftsController {
  private readonly messageBuilder = new MessageBuilder('Gifts');
  constructor(private readonly giftsService: GiftsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createGiftDto: CreateGiftDto) {
    const gift = await this.giftsService.create(createGiftDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new GiftsEntity(gift),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<GiftsEntity[]> {
    const gifts = this.giftsService.findAll();
    const giftEntities = (await gifts).map((gift) => new GiftsEntity(gift));
    return giftEntities;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const gift = await this.giftsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new GiftsEntity(gift),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGiftDto: UpdateGiftDto) {
    const gift = await this.giftsService.update(id, updateGiftDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new GiftsEntity(gift),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    const result = await this.giftsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new GiftsEntity(result),
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('sender/:id')
  async findByUserId(@Param('id') id: string) {
    const gifts = await this.giftsService.findByUserId(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      gifts.map((gift) => new GiftsEntity(gift)),
    );
  }
}
