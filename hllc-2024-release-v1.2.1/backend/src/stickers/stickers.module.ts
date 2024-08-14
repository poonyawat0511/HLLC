import { Module } from '@nestjs/common';
import { StickersService } from './stickers.service';
import { StickersController } from './stickers.controller';
import { Sticker, StickerSchema } from './schemas/stickers.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sticker.name, schema: StickerSchema }]),
  ],
  controllers: [StickersController],
  providers: [StickersService],
  exports: [
    MongooseModule.forFeature([{ name: Sticker.name, schema: StickerSchema }]),
    StickersService,
  ],
})
export class StickersModule {}
