import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isMongoId,
} from 'class-validator';

export function IsRecipient(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsRecipient',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;
          if (typeof value === 'string') return value === 'everyone';
          if (Array.isArray(value)) {
            if (value.length < 1) return false;
            return value.every((each) => {
              if (typeof each !== 'object' || !each) return false;
              return (
                ['MAJOR', 'SCHOOL', 'INDIVIDUAL'].includes(each.type) &&
                isMongoId(each.id)
              );
            });
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          const value = args.value;
          if (!value) {
            return `${args.property} must be "everyone" or array of "{ type, id }"`;
          }
          if (typeof value === 'string') {
            return `${args.property} type string can be "everyone" only`;
          }
          if (Array.isArray(value)) {
            if (value.length < 1) {
              return `${args.property} requires at least one element`;
            }
            for (const each of value) {
              if (typeof each !== 'object' || !each) {
                return `${args.property} must be array of '{ type, id }`;
              }
              if (each.type === null || each.type === undefined) {
                return `property "type" of each ${args.property} is required`;
              }
              if (each.id === null || each.id === undefined) {
                return `property "id" of each ${args.property} is required`;
              }
              if (!['MAJOR', 'SCHOOL', 'INDIVIDUAL'].includes(each.type)) {
                return `property "type" of each ${args.property} must be in 'MAJOR', 'SCHOOL', 'INDIVIDUAL'`;
              }
              if (!isMongoId(each)) {
                return `property "id" of each ${args.property} must be mongo id`;
              }
            }
          }

          return `${args.property} must be 'everyone' or array of '{ type, id }'`;
        },
      },
    });
  };
}
