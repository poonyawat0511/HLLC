import { plainToInstance } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isString,
  isNumber,
  isBoolean,
  validateSync,
  isISO8601,
  IsIn,
  isInt,
} from 'class-validator';
import { ArrayValue, ArrayValueType, SettingValue } from '../types/setting';

function ValidateArray(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'ValidateSettingValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { object } = args;
          const type = (object as any).type;

          if (value === null || value === undefined) {
            return true; // Allow nullable values
          }

          switch (type) {
            case 'text':
              return isString(value);
            case 'number':
              return isNumber(value);
            case 'boolean':
              return isBoolean(value);
            case 'date':
            case 'time':
            case 'timestamp':
              return isISO8601(value);
            default:
              return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} field is not valid for type ${args.object['type']}`;
        },
      },
    });
  };
}

const arrayValueTypes: ArrayValueType[] = [
  'boolean',
  'date',
  'number',
  'text',
  'time',
  'timestamp',
] as const;

class ArrayDto {
  @IsIn(arrayValueTypes)
  type: string;

  @ValidateArray()
  value: Exclude<SettingValue, ArrayValue[]>;
}

export function ValidateSettingValue(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'ValidateSettingValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { object, property } = args;
          const type = (object as any).type;

          if (value === null || value === undefined) {
            return true; // Allow nullable values
          }

          switch (type) {
            case 'text':
              return isString(value);
            case 'number':
              if (typeof value === 'string') {
                if (!isNaN(parseInt(value))) {
                  object[property] = parseInt(value);
                  return true;
                }
                return false;
              }
              return isInt(value);
            case 'boolean':
              return isBoolean(value);
            case 'date':
            case 'time':
            case 'timestamp':
              return isISO8601(value);
            case 'image':
              return true;
            case 'array':
              if (!Array.isArray(value)) return false;
              const arrayDataInstances = value.map((item) =>
                plainToInstance(ArrayDto, item),
              );
              const arrayDataErrors = arrayDataInstances.map((instance) =>
                validateSync(instance),
              );
              return arrayDataErrors.every((errors) => errors.length === 0);
            default:
              return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const { object } = args;
          const type = (object as any).type;
          switch (type) {
            case 'text':
              return `Value of setting type "text" must be a "string"`;
            case 'number':
              return `Value of setting type "number" must be a "number"`;
            case 'boolean':
              return `Value of setting type "boolean" must be "true" or "false"`;
            case 'date':
            case 'time':
            case 'timestamp':
              return `Value of setting type "${type}" must be in "ISO8601" format`;
            case 'image':
              return `Value of setting type "image" must be a "string" of "file"`;
            case 'array':
              return `Value of setting type "array" must be an array of object "{ type: string, value: any }"`;
            default:
              return `Invalid value type for setting type "${type}"`;
          }
        },
      },
    });
  };
}
