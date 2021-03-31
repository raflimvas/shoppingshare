import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "@app/models/list.model";
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
      id: [ 0, [ ] ],
      name: [ null, [ Validators.required ] ],
      description: [ null, [ Validators.required ] ]
    });
  }

  ngOnInit() {
    if (history.state.id_list && history.state.id_list > 0) {
      this.memberService.getListById(history.state.id_list).subscribe(x => {
        this.formGroup.setValue({
          id: x.id,
          name: x.name,
          description: x.description
        });
      });
    } else {
      this.router.navigate([ 'member' ]);
    }
  }

  onSubmitClicked(e: any): void {
    this.memberService.putList(new List({
      id: e.id,
      name: e.name,
      description: e.description,
      itens: []
    })).subscribe(x => {
      this.toastService.success('Sucesso', 'Lista atualizada com sucesso!');
      this.router.navigate(['member']);
    });
  }

}
