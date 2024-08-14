import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/auth/enums/roles.enum';

interface AccessOwnerGuardOptions {
  location?: 'params' | 'body' | 'query';
  field?: string;
  role?: Roles;
}

@Injectable()
export class MatchUserIdGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private options: AccessOwnerGuardOptions = {},
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const field = this.options.field || 'id'; // Default to 'id' if not provided
    const location = this.options.location || 'params';
    const id = request[location][field];

    if (this.options.role && !user.roles.includes(this.options.role)) {
      return true;
    }

    if (user.id !== id) {
      throw new ForbiddenException();
    }

    return true;
  }
}

export function userAccessGuard(
  options?: AccessOwnerGuardOptions,
): Type<CanActivate> {
  @Injectable()
  class CustomMatchUserIdGuard extends MatchUserIdGuard {
    constructor(reflector: Reflector) {
      super(reflector, options);
    }
  }

  return CustomMatchUserIdGuard;
}
