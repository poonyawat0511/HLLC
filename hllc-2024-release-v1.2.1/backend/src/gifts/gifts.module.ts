import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { GiftsController } from './gifts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gifts, GiftSchema } from './schemas/gifts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gifts.name, schema: GiftSchema }]),
  ],
  controllers: [GiftsController],
  providers: [GiftsService],
})
export class GiftsModule {}
