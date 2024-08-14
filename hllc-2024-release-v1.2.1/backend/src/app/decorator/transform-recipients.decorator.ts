import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { SchoolEntity } from 'src/schools/entities/school.entity';
import { MajorEntity } from 'src/majors/entities/major.entity';
import { UserEntity } from 'src/users/entities/user.entity';

function transformRecipient(value: any) {
  if (value.id && value.id._id) {
    const id = value.id._id.toString();
    if (value.type === 'SCHOOL') {
      return { ...value, id: new SchoolEntity({ _id: id, acronym: value.id.acronym }) };
    } else if (value.type === 'MAJOR') {
      return { ...value, id: new MajorEntity({ _id: id, acronym: value.id.acronym }) };
    } else if (value.type === 'INDIVIDUAL') {
      return { ...value, id: new UserEntity({ _id: id , name: value.id.name}) };
    }
  }
  return value;
}

function transformRecipients(value: any) {
  if (value === 'everyone') {
    return value;
  } else if (Array.isArray(value)) {
    return value.map(transformRecipient);
  }
  return value;
}

export function TransformRecipients() {
  return Transform(({ value }) => transformRecipients(value));
}
