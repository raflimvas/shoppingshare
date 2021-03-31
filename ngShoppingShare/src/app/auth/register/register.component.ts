import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { DisableHeader } from '@shared/decorators/disable-header.decorator';
import { UserSessionService } from '@shared/services/usersession.service';
import error_messages from '@assets/error-messages.json';
import { AuthService } from '../auth.service';
import { LOGIN_DATA_ID } from '../login/login.component';
import { Router } from '@angular/router';
import { ToastService } from '@app/shared/services/toast.service';
import { User } from '@app/models/user.model';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
@DisableHeader()
export class RegisterComponent {

  public backIcon = faArrowCircleLeft;

  public formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private userSessionService: UserSessionService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.formGroup = formBuilder.group({
      firstName: [ null, [ Validators.required ] ],
      lastName: [ null, [ Validators.required ] ],
      email: [ null, [ Validators.required, Validators.email ] ],
      password: [ null, [ Validators.required, Validators.minLength(6) ] ],
      repeatPassword: [ null, [ Validators.required ] ]
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
    if (name == 'RepeatPassword') {
      if (control.touched && (!control.valid || this.formGroup.hasError('notequal'))) return 'is-invalid';
      else if (control.touched && control.valid) return 'is-valid';
      else return '';
    } else {
      if (control.touched && !control.valid) return 'is-invalid';
      else if (control.touched && control.valid) return 'is-valid';
      else return '';
    }
  }

  public onFormSubmit(): void {
    this.authService.register(new User(this.formGroup.value)).subscribe(
      x => {
        localStorage.setItem(LOGIN_DATA_ID, JSON.stringify({ username: this.formGroup.value.email, remember: false }));
        this.toastService.success('Sucesso', 'Conta criada com sucesso!')
        this.router.navigate(['auth', 'login']);
      },
      err => this.toastService.error('Erro', 'Ocorreu um erro ao se registrar, tente novamente mais tarde!'),
      () => { }
    );
  }

  public onBack(): void {
    history.back();
  }

}
