import { PartialType } from '@nestjs/swagger';
import { CreateReportDto } from 'src/reports/dto/create-report.dto';

export class UpdateUserDto extends PartialType(CreateReportDto) {}
