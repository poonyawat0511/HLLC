import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from 'src/app/common/utils/error.util';
import { School } from './schemas/school.schema';
import { Major } from 'src/majors/schemas/major.schema';
import { extractQury } from 'src/app/common/utils/query.util';
import { Theme } from 'src/themes/schemas/theme.schema';

type FindSchoolOptions = {
  includes: string | string[];
};

type SchoolWithMajors = School & { majors?: Major[] };

type QueryResults = School | SchoolWithMajors;

@Injectable()
export class SchoolsService {
  private readonly errorBuilder = new ErrorBuilder('School');

  constructor(
    @InjectModel(School.name) private readonly schoolModel: Model<School>,
    @InjectModel(Major.name) private readonly majorModel: Model<Major>,
    @InjectModel(Theme.name) private readonly themeModel: Model<Theme>,
  ) {}

  async create(
    createSchoolDto: CreateSchoolDto,
    options?: FindSchoolOptions,
  ): Promise<QueryResults> {
    try {
      const schoolDoc = new this.schoolModel(createSchoolDto);
      const school = await schoolDoc.save();
      const schoolObj = school.toObject();

      const query = extractQury(options?.includes);

      if (query.majors) {
        const majors = await this.findSchoolMajors(school._id.toString());
        Object.assign(schoolObj, { majors });
      }

      return schoolObj;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          }),
        );
      }
      throw error;
    }
  }

  private async mergeSchoolsWithMajors(
    schools: School[],
  ): Promise<SchoolWithMajors[]> {
    const schoolIds = schools.map((school) => school._id.toString());
    const majors = await this.majorModel
      .find({ school: { $in: schoolIds } })
      .lean();
    const schoolsMap = new Map(
      schools.map((school) => [
        school._id.toString(),
        Object.assign(school, { majors: [] }),
      ]),
    );
    majors.forEach((major) => {
      const schoolId = major.school.toString();
      const school = schoolsMap.get(schoolId);
      if (!school) return;
      school.majors.push(major);
    });
    return schools;
  }

  async findAll(options?: FindSchoolOptions): Promise<QueryResults[]> {
    const schoolsPromise = this.schoolModel.find();
    const query = extractQury(options?.includes);
    const schools = await schoolsPromise.lean();
    if (query.majors) {
      await this.mergeSchoolsWithMajors(schools);
    }
    return schools;
  }

  async findOne(
    id: string,
    options?: FindSchoolOptions,
  ): Promise<QueryResults> {
    const school = await this.schoolModel.findById(id).lean();
    const query = extractQury(options?.includes);
    if (!school) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    if (query.majors) {
      const majors = await this.findSchoolMajors(id);
      Object.assign(school, { majors });
    }
    return school;
  }

  async update(
    id: string,
    updateSchoolDto: UpdateSchoolDto,
    options?: FindSchoolOptions,
  ): Promise<QueryResults> {
    const exists = await this.schoolModel.exists({ _id: id });

    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }

    const query = extractQury(options?.includes);
    const school = await this.schoolModel
      .findByIdAndUpdate(id, { $set: updateSchoolDto }, { new: true })
      .lean();

    if (query.majors) {
      const majors = await this.findSchoolMajors(id);
      Object.assign(school, { majors });
    }

    return school;
  }

  async remove(id: string): Promise<School | null> {
    const exists = await this.schoolModel.exists({ _id: id });
    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    return this.schoolModel.findByIdAndDelete(id).lean();
  }

  async findSchoolTheme(id: string): Promise<Theme> {
    const school = await this.findOne(id);
    const theme = await this.themeModel
      .findOne({ school: school._id.toString() })
      .lean();
    if (!theme) {
      throw new NotFoundException(`Theme of school id ${id} is not found`);
    }
    return theme;
  }

  async findSchoolMajors(id: string): Promise<Major[]> {
    const school = await this.schoolModel.exists({ _id: id });
    if (!school) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id }),
      );
    }
    const majors = await this.majorModel.find({ school: id }).lean();
    return majors;
  }
}
