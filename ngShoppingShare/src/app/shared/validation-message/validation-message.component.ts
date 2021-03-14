import { Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import error_messages from '../../../assets/error-messages.json';

@Component({
  selector: 'app-validation-message',
  template: `<span *ngIf="enabled" class="text-danger">{{ text }}</span>`,
  styles: [ `` ]
})
export class ValidationMessageComponent {

  @Input() name: string;
  @Input() set formGroup(value: FormGroup) {
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

  public get enabled(): boolean {
    return this.control.touched && !this.control.valid;
  }

}
