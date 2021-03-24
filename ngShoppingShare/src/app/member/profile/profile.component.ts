import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { UserSessionService } from '@shared/services/usersession.service';
import error_messages from '@assets/error-messages.json';
import { MemberService } from '../member.service';
import { DisableHeader } from '@app/shared/decorators/disable-header.decorator';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public backIcon = faArrowCircleLeft;

  public formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private userSessionService: UserSessionService,
    private memberService: MemberService
  ) {
    this.formGroup = formBuilder.group({
      FirstName: [ null, [ Validators.required ] ],
      LastName: [ null, [ Validators.required ] ],
      Email: [ null, [ Validators.required, Validators.email ] ],
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
        FirstName: firstName,
        LastName: lastName,
        Email: x.email,
        Password: '--null-password--',
        RepeatPassword: '--null-password--',
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
    if (control.touched && !control.valid) return 'is-invalid';
    else if (control.touched && control.valid) return 'is-valid';
    else return '';
  }

  public onFormSubmit(): void {
    this.memberService.putProfile({
      id_user: 0,
      nome: `${this.formGroup.value.FirstName} ${this.formGroup.value.LastName}`,
      email: this.formGroup.value.Email,
      senha: this.formGroup.value.Password
    }).subscribe(
      x => { console.log(x) },
      err => { console.error(err) },
      () => { }
    );
  }

  public onBack(): void {
    history.back();
  }

}
