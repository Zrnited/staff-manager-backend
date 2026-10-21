import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// CUSTOM DECORATORS. The first argument is the data passed in as parameter. Second arg is what you're returning out.
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    //inspect incoming request
    const request = context.switchToHttp().getRequest(); //gives us access to udnerlying request
    return request.currentUser;
  },
);
