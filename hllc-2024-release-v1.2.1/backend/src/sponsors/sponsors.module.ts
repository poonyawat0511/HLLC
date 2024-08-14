import { Module } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { SponsorsController } from './sponsors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sponsor, SponsorSchema } from './schemas/sponsors.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './sponsors.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sponsor.name, schema: SponsorSchema }]),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [SponsorsController],
  providers: [SponsorsService],
})
export class SponsorsModule {}
