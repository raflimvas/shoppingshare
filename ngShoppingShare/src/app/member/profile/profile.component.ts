import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { UserSessionService } from '@shared/services/usersession.service';
import error_messages from '@assets/error-messages.json';
import { MemberService } from '../member.service';
import { DisableHeader } from '@app/shared/decorators/disable-header.decorator';
import { ToastService } from '@app/shared/services/toast.service';
import { User } from '@app/models/user.model';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss']
})
@DisableHeader()
export class ProfileComponent implements OnInit {

  public backIcon = faArrowCircleLeft;

  public changePassword: boolean = false;
  public formGroup: FormGroup;
  public passFormGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private memberService: MemberService,
    private toastService: ToastService
  ) {
    this.formGroup = formBuilder.group({
      id: [ 0, [ ] ],
      firstName: [ null, [ Validators.required ] ],
      lastName: [ null, [ Validators.required ] ],
      email: [ null, [ Validators.required, Validators.email ] ],
    });
    this.passFormGroup = formBuilder.group({
      oldPassword: [ null, [ Validators.required, Validators.minLength(6) ] ],
      password: [ null, [ Validators.required, Validators.minLength(6) ] ],
      repeatPassword: [ null, [ Validators.required ] ]
    }, { validators: this.checkPasswords });
  }

  ngOnInit() {
    this.memberService.getUser().subscribe(x => {
      this.formGroup.setValue({
        id: x.id,
        firstName: x.firstName,
        lastName: x.lastName,
        email: x.email
      });
    });
  }

  public get passwordNotEqualText(): string {
    return error_messages['repeatPassword']['notequal'];
  }

  checkPasswords(formGroup: FormGroup) {
    try {
      const password = formGroup.get('password').value;
      const confirmPassword = formGroup.get('repeatPassword').value;
      return password === confirmPassword ? null : { notequal: true }
    }
    catch {
      return null;
    }
  }

  public getValidationClass(name: string): string {
    const control = this.formGroup.controls[name];
    if (control?.touched && control?.invalid) return 'is-invalid';
    else if (control?.touched && control?.valid) return 'is-valid';
    else return '';
  }

  public disableForm(): boolean {
    if (this.changePassword) {
      return this.formGroup.invalid ||
      this.passFormGroup.invalid || this.passFormGroup.pristine;
    } else {
      return this.formGroup.invalid || this.formGroup.pristine
    }
  }

  public onFormSubmit(): void {
    this.memberService.putProfile(new User({
      id: this.formGroup.value.id,
      firstName: this.formGroup.value.firstName,
      lastName: this.formGroup.value.lastName,
      email: this.formGroup.value.email,
      password: this.formGroup.value.password
    })).subscribe(
      x => {
        this.formGroup.setValue({
          id: x.id,
          firstName: x.firstName,
          lastName: x.lastName,
          email: x.email
        });
        this.formGroup.markAsUntouched();
        this.formGroup.markAsPristine();
        if (this.changePassword) {
          this.memberService.putPassword({
            email: x.email,
            password: this.passFormGroup.value.oldPassword,
            passwordNew: this.passFormGroup.value.password
          }).subscribe(
            x => {
              this.passFormGroup.setValue({
                oldPassword: null,
                password: null,
                repeatPassword: null
              });
              this.changePassword = false;
              this.passFormGroup.markAsUntouched();
              this.passFormGroup.markAsPristine();
              this.toastService.success('Sucesso', 'Perfil e senha alterado com sucesso');
            },
            err => {
              if (err.status === 401) {
                this.toastService.error('Erro', 'Senha anterior incorreta!')
              } else {
                this.toastService.error('Erro', 'Ocorreu um erro ao alterar seu perfil, tente novamente mais tarde!');
              }
            },
            () => { }
          );
        } else {

          this.toastService.success('Sucesso', 'Perfil alterado com sucesso');
        }
      },
      err => this.toastService.error('Erro', 'Ocorreu um erro ao alterar seu perfil, tente novamente mais tarde!'),
      () => { }
    );
  }

  public onBack(): void {
    history.back();
  }

}
