import { ApiStatus } from '../enums/api-status.enum';

export { ApiStatus };

export interface ApiResponse<T> {
  status: ApiStatus;
  message?: string;
  data?: T;
  errors?: any;
  requestId?: string;
  traceId?: string;
  timestamp: string;
}
