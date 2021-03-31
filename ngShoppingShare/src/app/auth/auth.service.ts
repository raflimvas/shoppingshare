import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "@app/models/user.model";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(credentials: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      environment.apiEndpoint + 'user/login',
      this.stringifyLogin(credentials),
      { observe: 'response' }
    ).pipe(
      map(x => x.body),
      catchError(err => throwError(err))
    );
  }

  private stringifyLogin(data: any) {
    const params = {
      email: data && data.email || null,
      password: data && data.password || null
    }
    return JSON.stringify(params);
  }

  public register(data: User): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      environment.apiEndpoint + 'user/signup',
      this.stringifyRegister(data),
      { observe: 'response' }
    ).pipe(
      map(x => x.body),
      catchError(err => throwError(err))
    );
  }

  private stringifyRegister(data: User): string {
    let params = new User(data);
    return JSON.stringify(params);
  }

}
