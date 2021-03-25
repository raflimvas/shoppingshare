import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { List } from "@app/models/list.model";
import { faEdit, faWrench } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MemberService } from "../member.service";

@Component({
  templateUrl: 'lists.component.html',
  styleUrls: [ 'lists.component.scss' ]
})
export class ListsComponent {

  public editIcon = faEdit;
  public wrenchIcon = faWrench;

  public lists: Observable<List[]>

  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit() {
    this.lists = this.memberService.getLists().pipe(map(x => x.lists));
  }

  onEdit(e) {
    history.pushState({ id_list: e }, '', '/member/updatelist')
    this.router.navigate(['member', 'updatelist'], { skipLocationChange: true });
  }

  onConfig(e) {
    history.pushState({ id_list: e }, '', '/member/configlist')
    this.router.navigate(['member', 'configlist'], { skipLocationChange: true });
  }

}
