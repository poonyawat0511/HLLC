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
  BadRequestException,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingEntity } from './entities/settings.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import {
  MessageBuilder,
  ResponseMethod,
  createResponse,
} from 'src/app/common/utils/response.util';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Setting } from './schemas/settings.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { transformFile } from 'src/app/common/utils/request.util';
import { storageConfig } from 'src/app/config/storage.config';

@Controller('settings')
export class SettingsController {
  private readonly messageBuilder = new MessageBuilder('Setting');
  constructor(private readonly settingService: SettingsService) {}

  @UseInterceptors(
    ClassSerializerInterceptor,
    FileInterceptor('value', {
      storage: storageConfig,
      fileFilter(req, file, callback) {
        if (req.body.type !== 'image') {
          return callback(
            new BadRequestException(
              `Setting type "${req.body.type}" is not support value type "file"`,
            ),
            false,
          );
        }
        return callback(null, true);
      },
    }),
  )
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Setting)
  @Post()
  async create(
    @Body() createSettingDto: CreateSettingDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (createSettingDto.type === 'image') {
      createSettingDto.value = file?.filename;
    }
    const settings = await this.settingService.create(createSettingDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new SettingEntity(settings),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Setting)
  @Get()
  async findAll() {
    const settings = await this.settingService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      settings.map((setting) => new SettingEntity(setting)),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Setting)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const setting = await this.settingService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new SettingEntity(setting),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Setting)
  @Get('key/:key')
  async findOneByKey(@Param('key') key: string) {
    const setting = await this.settingService.findOneByKey(key);
    return createResponse(
      HttpStatus.OK,
      `Get setting by key ${key} successfully`,
      new SettingEntity(setting),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Setting)
  @Get('group/:group')
  async findOneByGroup(@Param('group') group: string) {
    const settings = await this.settingService.findByGroup(group);
    return createResponse(
      HttpStatus.OK,
      `Get settings by group ${group} successfully`,
      settings.map((setting) => new SettingEntity(setting)),
    );
  }

  @UseInterceptors(
    ClassSerializerInterceptor,
    FileInterceptor('value', { storage: storageConfig }),
  )
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Setting)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSettingDto: UpdateSettingDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const type = await (async () => {
      // Transform file
      if (updateSettingDto.type) {
        return updateSettingDto.type;
      } else {
        const item = await this.settingService.findOne(id);
        return item.type;
      }
    })();

    if (type !== 'image' && file) {
      throw new BadRequestException(
        `Setting type "${type}" is not support value type "file"`,
      );
    }

    if (type === 'image') {
      transformFile(file, updateSettingDto, 'value');
    }

    const setting = await this.settingService.update(id, updateSettingDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new SettingEntity(setting),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Setting)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    const setting = await this.settingService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new SettingEntity(setting),
    );
  }
}
