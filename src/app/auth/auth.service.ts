import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(credentials: { email: string, senha: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      environment.apiEndpoint + 'user/login',
      JSON.stringify(credentials),
      { observe: 'response' }
    ).pipe(
      map(x => x.body),
      catchError(err => throwError(err))
    );
  }

  public register(data: { nome: string, email: string, senha: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      environment.apiEndpoint + 'user/signup',
      JSON.stringify(data),
      { observe: 'response' }
    ).pipe(
      map(x => x.body),
      catchError(err => throwError(err))
    );
  }

}
