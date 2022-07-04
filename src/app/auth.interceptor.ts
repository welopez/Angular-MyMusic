import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const bearerToken = localStorage.getItem("bearer_token");

    if (bearerToken) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", bearerToken)
      });

      return next.handle(cloned);
    }
      else {
        return next.handle(req);
    }
  }
}
