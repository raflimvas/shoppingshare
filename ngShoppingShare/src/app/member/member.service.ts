import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category } from "@app/models/category.model";
import { Item } from "@app/models/item.model";
import { List } from "@app/models/list.model";
import { User } from "@app/models/user.model";
import { UserSessionService } from "@app/shared/services/usersession.service";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()
export class MemberService {

  constructor(private http: HttpClient, private userSessionService: UserSessionService) { }

  public putProfile(data: User): Observable<User> {
    delete data.password;
    return this.http.put(
      environment.apiEndpoint + 'user',
      JSON.stringify(data),
      { observe: 'response' }
    ).pipe(
      map(x => new User(x.body)),
      catchError(err => throwError(err))
    );
  }

  public putPassword(data: { email: string, password: string, passwordNew: string }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      environment.apiEndpoint + 'user/changepassword',
      JSON.stringify(data),
      { observe: 'response' }
    ).pipe(
      map(x => x.body),
      catchError(err => throwError(err))
    );
  }

  public getLists(): Observable<List[]> {
    return this.http.get(
      environment.apiEndpoint + 'list/all',
      { observe: 'response' }
    ).pipe(
      map(x => (<any>x.body).lists.map((y: any) => new List(y))),
      catchError(err => throwError(err))
    );
  }

  public getListById(id: number): Observable<List> {
    return this.http.get(
      environment.apiEndpoint + 'list/' + id,
      { observe: 'response' }
    ).pipe(
      map(x => new List(x.body)),
      catchError(err => throwError(err))
    );
  }

  public postItem(entity: Item): Observable<Item> {
    return this.http.post(
      environment.apiEndpoint + 'item',
      JSON.stringify(entity),
      { observe: 'response' }
    ).pipe(
      map(x => new Item(x.body)),
      catchError(err => throwError(err))
    );
  }

  public getCategory(id: number): Observable<Category[]> {
    return this.http.get(
      environment.apiEndpoint + 'list/' + id,
      { observe: 'response' }
    ).pipe(
      map(x => ((<any>x.body).category ?? []).map(y => new Category(y))),
      catchError(err => throwError(err))
    );
  }

  public postCategory(entity: {name: string, listId: number}): Observable<Category> {
    return this.http.post(
      environment.apiEndpoint + 'list/category',
      JSON.stringify(entity),
      { observe: 'response' }
    ).pipe(
      map(x => new Category(x.body)),
      catchError(err => throwError(err))
    );
  }

  public deleteCategory(id: number): Observable<boolean> {
    return this.http.delete(
      environment.apiEndpoint + 'list/category/' + id,
      { observe: 'response' }
    ).pipe(
      map(x => true),
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
