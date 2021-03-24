import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { SpinnerService } from "../spinner/spinner.service";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.show();
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            setTimeout(() => { this.spinnerService.hide(); });
          }
        },
        (err: any) => {
          setTimeout(() => { this.spinnerService.hide(); });
        }
      )
    );
  }

}
