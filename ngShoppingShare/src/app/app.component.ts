import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

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

  public get contentStyle(): string {
    return this.enableHeader ? '90vh' : '100vh';
  }

}
