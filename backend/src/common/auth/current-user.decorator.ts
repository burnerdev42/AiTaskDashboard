import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  CustomRequest,
  AuthenticatedUser,
} from '../interfaces/request.interface';

/**
 * Parameter decorator that extracts the authenticated user from the request.
 * Must be used in conjunction with JwtAuthGuard or other authentication guards.
 *
 * @example
 * ```typescript
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: AuthenticatedUser) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser | undefined => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();
    return request.user;
  },
);
