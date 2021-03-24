import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { List, ListResult } from '@app/models/list.model';
import { User } from '@app/models/user.model';
import { faCog, faEdit, faPlusCircle, faSignOutAlt, faWrench } from '@fortawesome/free-solid-svg-icons';
import { UserSessionService } from '@shared/services/usersession.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: [ 'header.component.scss' ]
})
export class HeaderComponent implements OnInit {

  public editIcon = faEdit;
  public plusIcon = faPlusCircle;
  public wrenchIcon = faWrench;
  public logoutIcon = faSignOutAlt;
  public gearIcon = faCog;

  public showProfile = false;

  public userProfileData: User;
  public lists: List[];

  constructor(
    private userSessionService: UserSessionService,
    private headerService: HeaderService
  ) { }

  ngOnInit() {
    this.headerService.getUser().subscribe(x => {
      this.userProfileData = x;
    });
    this.headerService.getLists().subscribe(x => {
      this.lists = x;
    });
  }

  public get isLoggedIn(): boolean {
    return this.userSessionService.isLoggedIn;
  }

  public get userProfilePicture(): any {
    return this.userSessionService.getUserProfilePicture();
  }

  public onLogoutClick(): void {
    this.userSessionService.clear();
    window.location.reload();
  }

}
