import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@app/shared/services/toast.service';
import { faArrowCircleLeft, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { DisableHeader } from '@shared/decorators/disable-header.decorator';
import { UserSessionService } from '@shared/services/usersession.service';
import { AuthService } from '../auth.service';

export const LOGIN_DATA_ID = 'login-data'

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

  constructor(
    formBuilder: FormBuilder,
    private userSessionService: UserSessionService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    const loginData: LoginData = JSON.parse(localStorage.getItem(LOGIN_DATA_ID)) ?? { username: null, remember: false };
    this.formGroup = formBuilder.group({
      username: [ loginData.username, [ Validators.required, Validators.email ] ],
      password: [ null, [ Validators.required ] ],
      rememberUsername: [ loginData.remember, [] ]
    });
  }

  public getValidationClass(name: string): string {
    const control = this.formGroup.controls[name];
    if (control.touched && !control.valid) return 'is-invalid';
    else if (control.touched && control.valid) return 'is-valid';
    else return '';
  }

  public onFormSubmit(): void {
    if (this.formGroup.value.rememberUsername === true) {
      localStorage.setItem(LOGIN_DATA_ID, JSON.stringify({ username: this.formGroup.value.username, remember: true }));
    } else {
      localStorage.setItem(LOGIN_DATA_ID, JSON.stringify({ username: null, remember: false }));
    }

    this.authService.login(this.formGroup.value).subscribe(
      x => {
        this.userSessionService.token = x.token;
        this.router.navigate(['/']);
      },
      err => {
        if (err.status == 401) this.toastService.error('Erro', 'Usuário e/ou senha inválidos!');
        else this.toastService.error('Erro', 'Ocorreu um erro durante o login, tente novamente mais tarde!');
      },
      () => { }
    );
  }

  public onBack(): void {
    history.back();
  }

}
