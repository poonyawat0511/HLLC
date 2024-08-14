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
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from 'src/app/common/utils/response.util';
import { RoomEntity } from './entities/room.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/app/config/storage.config';
import { ResponseDto } from 'src/app/common/dto/response.dto';

const roomImageUploadInterCepters = FileInterceptor('roomImage', {
  storage: storageConfig,
});
@Controller('rooms')
export class CommunitiesController {
  private readonly messageBuilder = new MessageBuilder('Room');

  constructor(private readonly communitiesService: CommunitiesService) {}

  @UseInterceptors(ClassSerializerInterceptor, roomImageUploadInterCepters)
  @Post()
  async create(
    @Body() createRoomDto: CreateRoomDto,
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
    const roomImage = file?.filename;
    const room = await this.communitiesService.create({
      ...createRoomDto,
      roomImage,
    });
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new RoomEntity(room),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const rooms = await this.communitiesService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      rooms.map((room) => new RoomEntity(room)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const room = await this.communitiesService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new RoomEntity(room),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor, roomImageUploadInterCepters)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
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
    const roomImage = file?.filename;
    const dtoWithPhoto = { ...updateRoomDto, roomImage };
    const room = await this.communitiesService.update(id, dtoWithPhoto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new RoomEntity(room),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const room = await this.communitiesService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new RoomEntity(room),
    );
  }
}
