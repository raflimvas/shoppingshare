import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastService } from "@app/shared/services/toast.service";
import { MemberService } from "../member.service";

@Component({
  templateUrl: 'lists.config.component.html'
})
export class ListsConfigComponent implements OnInit {

  constructor(
    formBuilder: FormBuilder,
    private memberService: MemberService,
    private router: Router,
    private toastService: ToastService
  ) {

  }

  ngOnInit() {
    if (history.state.id_list && history.state.id_list > 0) {
      this.memberService.getListById(history.state.id_list).subscribe(x => {
      });
    } else {
      this.router.navigate([ 'member' ]);
    }
  }

}
