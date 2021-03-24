import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { User } from '@app/models/user.model';

const TOKEN_STORAGE_ID = 'access_token';

@Injectable()
export class UserSessionService {

  constructor(private http: HttpClient) { }

  public get token(): string {
    return sessionStorage.getItem(TOKEN_STORAGE_ID);
  }

  public set token(value: string) {
    sessionStorage.setItem(TOKEN_STORAGE_ID, value);
  }

  public get isLoggedIn(): boolean {
    return this.token != null;
  }

  public getTokenSubject(): number {
    try {
      const token: any = jwt_decode(this.token);
      return token.id_user;
    }
    catch (err) { }
  }

  public getUserProfilePicture(): any {
    return '/assets/images/blank-profile.png';
  }

  public clear(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_ID);
  }

}
