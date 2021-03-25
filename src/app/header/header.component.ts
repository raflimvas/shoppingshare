import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { List, ListResult } from '@app/models/list.model';
import { User } from '@app/models/user.model';
import { faCog, faEdit, faPlusCircle, faSignOutAlt, faWrench } from '@fortawesome/free-solid-svg-icons';
import { UserSessionService } from '@shared/services/usersession.service';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: [ 'header.component.scss' ]
})
export class HeaderComponent implements OnInit {

  private profileEnabled: boolean = false;
  private profileReady: boolean = false;

  public editIcon = faEdit;
  public plusIcon = faPlusCircle;
  public wrenchIcon = faWrench;
  public logoutIcon = faSignOutAlt;
  public gearIcon = faCog;

  public get showProfile(): boolean {
    return this.profileEnabled && this.profileReady;
  };

  public syncData: {user: User, lists: List[]};
  public asyncData: Observable<{user: User, lists: List[]}>;

  @ViewChild('profilemodal') public profileModal: ElementRef;

  constructor(
    private userSessionService: UserSessionService,
    private headerService: HeaderService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.showProfile && this.profileModal?.nativeElement?.contains(e.target) === false) {
        this.toogleProfile();
      }
    });
  }

  ngOnInit() {
    this.asyncData = forkJoin([
      this.headerService.getUser(),
      this.headerService.getLists()
    ]).pipe(map(x => { return { user: new User(x[0]) , lists: (x[1] ?? []).map(x => new List(x)) } }));
  }

  public toogleProfile(): void {
    this.profileReady = false;
    this.profileEnabled = !this.profileEnabled;
    if (this.profileEnabled) {
      this.asyncData.subscribe(x => {
        this.syncData = x;
        this.profileReady = true;
      });
    }
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

  onEdit(e: number) {
    this.toogleProfile();
    history.pushState({ id_list: e }, '', '/member/updatelist')
    this.router.navigate(['member', 'updatelist'], { skipLocationChange: true });
  }

  onConfig(e) {
    this.toogleProfile();
    history.pushState({ id_list: e }, '', '/member/configlist')
    this.router.navigate(['member', 'configlist'], { skipLocationChange: true });
  }

}
