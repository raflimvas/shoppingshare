import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import error_messages from '../../../assets/error-messages.json';

@Component({
  selector: 'app-validation-message',
  template: `<span *ngIf='enabled' [ngClass]='class'>{{ text }}</span>`,
  styles: [ `` ]
})
export class ValidationMessageComponent {

  private _class: string = 'text-danger ';

  @Input() public name: string;
  @Input() public set class(value: string) {
    this._class += value;
  }
  @Input() public set formGroup(value: FormGroup) {
    if (this.name) this.control = <any>value.controls[this.name];
    else this.control = value;
  }

  public control: any;

  public get text(): string {
    if (this.control.errors) {
      for (const err in this.control.errors) {
        return (error_messages[this.name ?? ''] ?? {} )[err ?? ''] ?? error_messages[''][''];
      }
    }
    return '';
  }

  public get class(): string {
    return this._class;
  }

  public get enabled(): boolean {
    return this.control.touched && !this.control.valid;
  }

}
