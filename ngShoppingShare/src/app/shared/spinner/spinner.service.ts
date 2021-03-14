import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export interface ISpinnerState {
  visible: boolean;
}

@Injectable()
export class SpinnerService {

  private subject = new Subject<ISpinnerState>();
  private count: number = 0;

  public spinnerState = <Observable<ISpinnerState>>this.subject;

  constructor() { }

  public show(): void {
    if (this.count < 0) {
      this.count = 0;
    }

    this.count++;

    if (this.count > 0) {
      this.subject.next({ visible: true });
    }
  }

  public hide(): void {
    this.count--;
    if (this.count <= 0) {
      this.subject.next({ visible: false });
    }
  }

}
