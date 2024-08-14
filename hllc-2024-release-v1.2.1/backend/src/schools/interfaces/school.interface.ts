import { Types } from 'mongoose';

interface SchoolInterface {
  _id: Types.ObjectId;
  name: {
    th: string;
    en: string;
  };
  acronym: string;
  detail: {
    th: string;
    en: string;
  };
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
  photos: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
}

export default SchoolInterface;
