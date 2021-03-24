import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-lists-form',
  templateUrl: 'lists.form.component.html'
})
export class ListsFormComponent {

  @Input() public formGroup: FormGroup;
  @Input() public submitText: string = 'Enviar';
  @Output() public submitClick = new EventEmitter<any>();

  constructor() { }

  public getValidationClass(name: string): string {
    const control = this.formGroup.controls[name];
    if (control.touched && !control.valid) return 'is-invalid';
    else if (control.touched && control.valid) return 'is-valid';
    else return '';
  }

  onSubmitClick() {
    this.submitClick.emit(this.formGroup.value);
  }

}
