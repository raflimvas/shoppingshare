import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

const TOKEN_STORAGE_ID = 'login_token';

@Injectable()
export class UserSessionService {

  constructor() { }

  public get isLoggedIn(): boolean {
    return sessionStorage.getItem(TOKEN_STORAGE_ID) != null;
  }

  public login(): Observable<any> {
    return of({});
  }

  public getTokenObject(): any {
    return {};
  }

}
