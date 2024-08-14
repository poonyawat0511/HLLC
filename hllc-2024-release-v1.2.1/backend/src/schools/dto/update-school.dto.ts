export class UpdateSchoolDto {
  name?: {
    th: string;
    en: string;
  } = undefined;

  acronym?: string = undefined;

  detail?: {
    th: string;
    en: string;
  } = undefined;

  photos?: {
    first?: string;
    second?: string;
    third?: string;
    fourth?: string;
  } = undefined;
}
