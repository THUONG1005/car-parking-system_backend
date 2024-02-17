import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleType } from '../../common/types';

export const UserRoleGuard = (role?: RoleType): Type<CanActivate> => {
  @Injectable()
  class UserRoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      if (role === request.user?.role) {
        return true;
      } else {
        throw new UnauthorizedException();
      }
    }
  }

  return mixin(UserRoleGuardMixin);
};
