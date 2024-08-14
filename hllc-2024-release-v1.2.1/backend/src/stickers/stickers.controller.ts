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
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { StickersService } from './stickers.service';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { UpdateStickerDto } from './dto/update-sticker.dto';
import { storageConfig } from 'src/app/config/storage.config';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { ResponseDto } from 'src/app/common/dto/response.dto';
import { StickerEntity } from './entities/sticker.entity';

const stickerUploadInterCepters = FileInterceptor('sticker', {
  storage: storageConfig,
});

@Controller('stickers')
export class StickersController {
  private readonly messageBuilder = new MessageBuilder('Sticker');
  constructor(private readonly stickersService: StickersService) {}

  @UseInterceptors(ClassSerializerInterceptor, stickerUploadInterCepters)
  @Post()
  async create(
    @Body() createStickerDto: CreateStickerDto,
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
    console.log('Uploaded file:', file);
    const sticker = file?.filename;
    const stickers = await this.stickersService.create({
      ...createStickerDto,
      sticker,
    });
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new StickerEntity(stickers),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const stickers = await this.stickersService.findAll();
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      stickers.map((sticker) => new StickerEntity(sticker)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const stickers = await this.stickersService.findOne(id);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new StickerEntity(stickers),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor, stickerUploadInterCepters)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStickerDto: UpdateStickerDto,
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
    const sticker = file?.filename;
    const dtoWithPhoto = { ...updateStickerDto, sticker };
    const stickers = await this.stickersService.update(id, dtoWithPhoto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new StickerEntity(stickers),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const stickers = await this.stickersService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new StickerEntity(stickers),
    );
  }
}
