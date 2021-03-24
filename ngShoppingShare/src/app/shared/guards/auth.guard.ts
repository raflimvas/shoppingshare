import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSessionService } from '@shared/services/usersession.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userSessionService: UserSessionService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.userSessionService.isLoggedIn;
  }

}
