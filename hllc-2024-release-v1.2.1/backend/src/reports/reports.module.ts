import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsService } from './reports.service';
import { Report, ReportSchema } from './schema/reports.schema';
import { ReportsController } from './reports.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './reports.permissions';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    CaslModule.forFeature({ permissions }),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
