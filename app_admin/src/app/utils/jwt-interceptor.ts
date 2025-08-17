import { Injectable, Provider } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Authentication } from '../services/authentication';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authentication: Authentication) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don’t attach Authorization for auth endpoints
    const url = request.url || '';
    const isAuthAPI = url.startsWith('http://localhost:3000/api/login')
      || url.startsWith('http://localhost:3000/api/register')
      || url.startsWith('/api/login')
      || url.startsWith('/api/register')
      || url.endsWith('/login')
      || url.endsWith('/register');

    if (this.authentication.isLoggedIn() && !isAuthAPI) {
      const token = this.authentication.getToken();
      const authReq = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(authReq);
    }

    return next.handle(request);
  }
}

// Export a provider so we can register this interceptor globally
export const authInterceptProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
};
