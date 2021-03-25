import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: [ 'spinner.component.scss' ]
})
export class SpinnerComponent implements OnInit, OnDestroy {

  public visible: boolean = false;

  private spinnerStateChanged: Subscription;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.visible = false;
    this.spinnerStateChanged = this.spinnerService.spinnerState.subscribe(state => {
      if (state.visible) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    });
  }

  ngOnDestroy() {
    this.spinnerStateChanged.unsubscribe();
  }

}
