import { tap, Observable } from 'rxjs';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dt = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        console.log(`[${request.method}] URL: ${request.url}`);
        console.log(`Tempo de execução ${Date.now() - dt}`);
      }),
    );
  }
}
