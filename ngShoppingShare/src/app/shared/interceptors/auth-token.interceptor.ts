import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable } from "rxjs";
import { UserSessionService } from "../services/usersession.service";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private userSessionService: UserSessionService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.userSessionService.isLoggedIn) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.userSessionService.token}`
        }
      });
    }
    return next.handle(req);
  }

}
