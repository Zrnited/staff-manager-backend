import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //reject request if user is not signed in

    //SEE IF USER IS SIGNED IN
    const request = context.switchToHttp().getRequest();
    //RETURN A BOOLEAN VALUE
    return request.session.userId;
  }
}
