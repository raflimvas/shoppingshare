import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { UserSessionService } from '@shared/services/usersession.service';
import error_messages from '@assets/error-messages.json';
import { MemberService } from '../member.service';
import { DisableHeader } from '@app/shared/decorators/disable-header.decorator';
import { ToastService } from '@app/shared/services/toast.service';

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
      Id: [ 0, [ ] ],
      FirstName: [ null, [ Validators.required ] ],
      LastName: [ null, [ Validators.required ] ],
      Email: [ null, [ Validators.required, Validators.email ] ],
    });
    this.passFormGroup = formBuilder.group({
      OldPassword: [ null, [ Validators.required, Validators.minLength(6) ] ],
      Password: [ null, [ Validators.required, Validators.minLength(6) ] ],
      RepeatPassword: [ null, [ Validators.required ] ]
    }, { validators: this.checkPasswords });
  }

  ngOnInit() {
    this.memberService.getUser().subscribe(x => {
      const index = x.nome.search(/\s/g);
      const firstName = x.nome.substr(0, index);
      const lastName = x.nome.substr(index + 1, x.nome.length - firstName.length - 1);
      this.formGroup.setValue({
        Id: x.id_user,
        FirstName: firstName,
        LastName: lastName,
        Email: x.email,
      });
    });
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
    this.memberService.putProfile({
      id_user: this.formGroup.value.Id,
      nome: `${this.formGroup.value.FirstName} ${this.formGroup.value.LastName}`,
      email: this.formGroup.value.Email,
      senha: this.formGroup.value.Password
    }).subscribe(
      x => {
        const index = x.nome.search(/\s/g);
        const firstName = x.nome.substr(0, index);
        const lastName = x.nome.substr(index + 1, x.nome.length - firstName.length - 1);
        this.formGroup.setValue({
          Id: this.formGroup.value.Id,
          FirstName: firstName,
          LastName: lastName,
          Email: x.email,
        });
        this.formGroup.markAsUntouched();
        this.formGroup.markAsPristine();
        if (this.changePassword) {
          this.memberService.putPassword({
            email: x.email,
            senha_atual: this.passFormGroup.value.OldPassword,
            senha_nova: this.passFormGroup.value.Password
          }).subscribe(
            x => {
              this.passFormGroup.setValue({
                OldPassword: null,
                Password: null,
                RepeatPassword: null
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
