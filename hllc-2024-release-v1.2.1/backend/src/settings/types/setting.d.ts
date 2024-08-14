export type SettingType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'timestamp'
  | 'image'
  | 'array';

export type ArrayValueType = Exclude<SettingType, 'array' | 'image'>;

export type ArrayValue = {
  [K in ArrayValueType]: {
    type: K;
    value?: SettingDeclarator[K];
  };
}[ArrayValueType];

export type SettingValue = Date | number | string | boolean | ArrayValue[];

interface SettingDeclarator extends Record<SettingType, SettingValue> {
  text: string;
  number: number;
  date: Date;
  time: Date;
  timestamp: number;
  image: string;
  boolean: boolean;
  array: ArrayValue[];
}

export type Setting = {
  [K in SettingType]: {
    id?: string;
    key: string;
    value?: SettingDeclarator[K];
    type: K;
    group?: string;
    description?: string;
  };
}[SettingType];
