import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { SpinnerService } from './shared/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.scss' ]
})
export class AppComponent {

  constructor(private route : ActivatedRoute, private router: Router) { }

  public get enableHeader(): boolean {
    let finished = false;
    let currentRoute: ActivatedRouteSnapshot = this.route.snapshot;
    while (!finished) {
      if (currentRoute.children.length > 0) {
        currentRoute = currentRoute.children[0];
      } else {
        finished = true;
      }
    }

    if (currentRoute.component === null || typeof currentRoute.component === 'string') return true;

    const disableHeader = currentRoute.component.prototype.disableHeader ?? false;

    return !disableHeader;
  }

}
