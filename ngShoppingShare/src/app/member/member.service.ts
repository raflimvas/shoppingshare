import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { List, ListResult } from "@app/models/list.model";
import { User } from "@app/models/user.model";
import { LocalDbService } from "@app/shared/services/localdb.service";
import { UserSessionService } from "@app/shared/services/usersession.service";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()
export class MemberService {

  constructor(private http: HttpClient, private userSessionService: UserSessionService) { }

  public putProfile(data: User): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      environment.apiEndpoint + 'user',
      JSON.stringify(data),
      { observe: 'response' }
    ).pipe(
      map(x => x.body),
      catchError(err => throwError(err))
    );
  }

  public getLists(): Observable<ListResult> {
    return this.http.get(
      environment.apiEndpoint + 'list/all',
      { observe: 'response' }
    ).pipe(
      map(x => new ListResult(x.body)),
      catchError(err => throwError(err))
    );
  }

  public getListById(id: number): Observable<List> {
    return this.http.get(
      environment.apiEndpoint + 'list/' + id,
      { observe: 'response' }
    ).pipe(
      map(x => new List(x.body[0])),
      catchError(err => throwError(err))
    );
  }

  public postList(entity: List): Observable<any> {
    return this.http.post(
      environment.apiEndpoint + 'list',
      JSON.stringify(entity),
      { observe: 'response' }
    ).pipe(
      map(x => { return x.body }),
      catchError(err => throwError(err))
    );
  }

  public putList(entity: List): Observable<any> {
    return this.http.put(
      environment.apiEndpoint + 'list',
      JSON.stringify(entity),
      { observe: 'response' }
    ).pipe(
      map(x => { return x.body }),
      catchError(err => throwError(err))
    );
  }

  public getUser(): Observable<User> {
    const id = this.userSessionService.getTokenSubject();
    return this.http.get(
      environment.apiEndpoint + 'user/' + id,
      { observe: 'response' }
    ).pipe(
      map(res => new User(res.body)),
      catchError(err => throwError(err))
    );
  }

}
