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
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemEntity } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Item } from './schemas/item.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { transformFile } from 'src/app/common/utils/request.util';
import { storageConfig } from 'src/app/config/storage.config';

@Controller('items')
export class ItemsController {
  private readonly messageBuilder = new MessageBuilder('Item');

  constructor(private readonly itemsService: ItemsService) {}

  @UseInterceptors(
    ClassSerializerInterceptor,
    FileInterceptor('image', { storage: storageConfig }),
  )
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Item)
  @Post()
  async create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/*' })
        .addMaxSizeValidator({ maxSize: 255 * 1024 }) // 255 KB limit
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    image: Express.Multer.File,
  ) {
    Object.assign(createItemDto, { image: image.filename });
    const item = await this.itemsService.create(createItemDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new ItemEntity(item),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Item)
  @Get()
  async findAll() {
    const items = await this.itemsService.findAll();
    const itemEntities = items.map((item) => new ItemEntity(item));
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      itemEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Item)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.itemsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new ItemEntity(item),
    );
  }

  @UseInterceptors(
    ClassSerializerInterceptor,
    FileInterceptor('image', { storage: storageConfig }),
  )
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Item)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/*' })
        .addMaxSizeValidator({ maxSize: 255 * 1024 }) // 255 KB limit
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    image: Express.Multer.File,
  ) {
    transformFile(image, updateItemDto, 'image');
    const item = await this.itemsService.update(id, updateItemDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new ItemEntity(item),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Item)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    const item = await this.itemsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new ItemEntity(item),
    );
  }
}
