import { Component } from "@angular/core";
import { UserSessionService } from "src/app/shared/services/usersession.service";

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: [ 'header.component.scss' ]
})
export class HeaderComponent {

  constructor(private userSessionService: UserSessionService) { }

  public get isLoggedIn(): boolean {
    return this.userSessionService.isLoggedIn;
  }

  public onLogoutClick(): void {

  }

  public onLoginAuthenticated(event: any): void {

  }

}
