import { Component, ElementRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { faArrowCircleLeft, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { DisableHeader } from "src/app/shared/decorators/disable-header.decorator";
import { UserSessionService } from "src/app/shared/services/usersession.service";

const LOGIN_DATA_ID = 'login-data'

type LoginData = { username: string, remember: boolean }

@Component({
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.scss' ]
})
@DisableHeader()
export class LoginComponent {

  public loginIcon = faSignInAlt;
  public backIcon = faArrowCircleLeft;

  public formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, private userSessionService: UserSessionService) {
    const loginData: LoginData = JSON.parse(localStorage.getItem(LOGIN_DATA_ID)) ?? { username: null, remember: false };
    this.formGroup = formBuilder.group({
      Username: [ loginData.username, [ Validators.required, Validators.email ] ],
      Password: [ null, [ Validators.required ] ],
      RememberUsername: [ loginData.remember, [] ]
    });
  }

  public getValidationClass(name: string): string {
    const control = this.formGroup.controls[name];
    if (control.touched && !control.valid) return 'is-invalid';
    else if (control.touched && control.valid) return 'is-valid';
    else return '';
  }

  public onFormSubmit(): void {
    if (this.formGroup.value.RememberUsername === true) {
      localStorage.setItem(LOGIN_DATA_ID, JSON.stringify({ username: this.formGroup.value.Username, remember: true }));
    }
    this.userSessionService.login();
  }

  public onBack(): void {
    history.back();
  }

}
