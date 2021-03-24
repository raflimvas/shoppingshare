import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LocalDbService } from "@app/shared/services/localdb.service";
import { ToastService } from "@app/shared/services/toast.service";
import { MemberService } from "../member.service";

@Component({
  templateUrl: 'lists.create.component.html'
})
export class ListsCreateComponent {

  public formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private memberService: MemberService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.formGroup = formBuilder.group({
      Id: [ 0, [ ] ],
      Nome: [ null, [ Validators.required ] ],
      Descricao: [ null, [ Validators.required ] ]
    });
  }

  onSubmitClicked(e: any): void {
    this.memberService.postList(<any>{
      nome: e.Nome,
      descricao: e.Descricao
    }).subscribe(x => {
      this.toastService.success('Sucesso', 'Lista criada com sucesso!');
      this.router.navigate(['member']);
    });
  }

}
