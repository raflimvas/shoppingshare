import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "@app/shared/services/toast.service";
import { MemberService } from "../member.service";

@Component({
  templateUrl: 'lists.update.component.html'
})
export class ListsUpdateComponent {

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

  ngOnInit() {
    if (history.state.id_list && history.state.id_list > 0) {
      this.memberService.getListById(history.state.id_list).subscribe(x => {
        this.formGroup.setValue({
          Id: x.id_list,
          Nome: x.nome,
          Descricao: x.descricao
        });
      });
    } else {
      this.router.navigate([ 'member' ]);
    }
  }

  onSubmitClicked(e: any): void {
    this.memberService.putList({
      id_list: e.Id,
      nome: e.Nome,
      descricao: e.Descricao,
      itens: []
    }).subscribe(x => {
      this.toastService.success('Sucesso', 'Lista atualizada com sucesso!');
      this.router.navigate(['member']);
    });
  }

}
