import { Component, ElementRef } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { DisableHeader } from "src/app/shared/decorators/disable-header.decorator";
import { UserSessionService } from "src/app/shared/services/usersession.service";
import error_messages from '../../../assets/error-messages.json';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
@DisableHeader()
export class RegisterComponent {

  public loginIcon = faSignInAlt;

  public formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, private userSessionService: UserSessionService) {
    this.formGroup = formBuilder.group({
      FirstName: [ null, [ Validators.required ] ],
      LastName: [ null, [ Validators.required ] ],
      Email: [ null, [ Validators.required, Validators.email ] ],
      Password: [ null, [ Validators.required, Validators.minLength(6) ] ],
      RepeatPassword: [ null, [ Validators.required ] ]
    }, { validators: this.checkPasswords });
  }

  public get passwordNotEqualText(): string {
    return error_messages['RepeatPassword']['notequal'];
  }

  checkPasswords(formGroup: FormGroup) {
    try {
      const password = formGroup.get('Password').value;
      const confirmPassword = formGroup.get('RepeatPassword').value;
      return password === confirmPassword ? null : { notequal: true }
    }
    catch {
      return null;
    }
  }

  public getValidationClass(name: string): string {
    const control = this.formGroup.controls[name];
    if (control.touched && !control.valid) return 'is-invalid';
    else if (control.touched && control.valid) return 'is-valid';
    else return '';
  }

  public onFormSubmit(): void {

  }

}
