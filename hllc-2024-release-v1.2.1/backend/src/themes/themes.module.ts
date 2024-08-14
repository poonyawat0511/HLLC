import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Theme, ThemeSchema } from './schemas/theme.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './themes.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Theme.name, schema: ThemeSchema }]),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [ThemesController],
  providers: [ThemesService],
  exports: [
    MongooseModule.forFeature([{ name: Theme.name, schema: ThemeSchema }]),
    ThemesService,
  ],
})
export class ColorsModule {}
