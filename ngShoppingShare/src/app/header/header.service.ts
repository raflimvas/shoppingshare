import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { List } from "@app/models/list.model";
import { User } from "@app/models/user.model";
import { UserSessionService } from "@app/shared/services/usersession.service";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()
export class HeaderService {

  constructor(
    private userSessionService: UserSessionService,
    private http: HttpClient
  ) { }

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

  public getLists(): Observable<List[]> {
    return this.http.get(
      environment.apiEndpoint + 'list/all',
      { observe: 'response' }
    ).pipe(
      map(x => (<any>x.body).map((y: any) => new List(y))),
      catchError(err => throwError(err))
    );
  }

}
