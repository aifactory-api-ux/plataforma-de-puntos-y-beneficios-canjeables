import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | PaginatedResponse<T>>
{
  private readonly logger = new Logger(TransformInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | PaginatedResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      map((data) => {
        const response: ApiResponse<T> = {
          success: true,
          data: data as T,
          timestamp: new Date().toISOString(),
          path: url,
        };

        if (this.isPaginated(data)) {
          const paginatedData = data as PaginatedResponse<T>;
          return {
            ...response,
            data: paginatedData.data,
            meta: paginatedData.meta,
          };
        }

        return response;
      }),
    );
  }

  private isPaginated(data: unknown): data is PaginatedResponse<unknown> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'meta' in data &&
      'data' in data &&
      Array.isArray((data as PaginatedResponse<unknown>).data)
    );
  }
}
