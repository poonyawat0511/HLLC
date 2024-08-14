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
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ThemesService as ThemesService } from './themes.service';
import { ThemeEntity } from './entities/theme.entity';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Theme } from './schemas/theme.schema';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { transformFile } from 'src/app/common/utils/request.util';
import { assignObjectValue } from 'src/app/common/utils/object.util';
import { storageConfig } from 'src/app/config/storage.config';

@Controller('themes')
export class ThemesController {
  private readonly messageBuilder = new MessageBuilder('Theme');

  constructor(private readonly themesService: ThemesService) {}

  @UseInterceptors(
    ClassSerializerInterceptor,
    AnyFilesInterceptor({
      storage: storageConfig,
      fileFilter(_req, file, callback) {
        const valid = file.fieldname.startsWith('assets[');
        if (!valid) {
          callback(
            new BadRequestException('Invalid file field expected assets[any]'),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Theme)
  @Post()
  async create(
    @Body() createThemeDto: CreateThemeDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    files?.forEach((file) => {
      const field = file.fieldname.replace('assets[', '').replace(']', '');
      assignObjectValue(createThemeDto, `assets.${field}`, file.filename);
    });
    const theme = await this.themesService.create(createThemeDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new ThemeEntity(theme),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Theme)
  @Get()
  async findAll() {
    const themes = await this.themesService.findAll();
    const themeEntities = themes.map((theme) => new ThemeEntity(theme));
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      themeEntities,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Theme)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const theme = await this.themesService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new ThemeEntity(theme),
    );
  }

  @UseInterceptors(
    ClassSerializerInterceptor,
    AnyFilesInterceptor({
      storage: storageConfig,
      fileFilter(_req, file, callback) {
        const valid = file.fieldname.startsWith('assets[');
        if (!valid) {
          callback(
            new BadRequestException('Invalid file field expected assets[any]'),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Theme)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateThemeDto: UpdateThemeDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    files?.forEach((file) => {
      const field = file.fieldname.replace('assets[', '').replace(']', '');
      transformFile(file, updateThemeDto, `assets.${field}`);
    });
    const theme = await this.themesService.update(id, updateThemeDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new ThemeEntity(theme),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Theme)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    const theme = await this.themesService.remove(id);

    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new ThemeEntity(theme),
    );
  }
}
