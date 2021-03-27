import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { Category, List, ListItem } from "@app/models/list.model";
import { ToastService } from "@app/shared/services/toast.service";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { MemberService } from "../member.service";

@Component({
  templateUrl: 'lists.config.component.html',
  styleUrls: ['lists.config.component.scss']
})
export class ListsConfigComponent implements OnInit {

  public xIcon = faTimes;
  public plusIcon = faPlus;

  public showCategoryModal: boolean = false;
  public categoryName: string = null;

  public showItemModal: boolean = false;
  public item: ListItem = null;

  public model: List = <any>{};
  public categories: Category[];

  constructor(
    formBuilder: FormBuilder,
    private memberService: MemberService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    if (history.state.id_list && history.state.id_list > 0) {
      this.memberService.getListById(history.state.id_list).subscribe(x => {
        this.model = x;
        console.log(x);
      });
      this.memberService.getCategory(history.state.id_list).subscribe(x => {
        this.categories = x.categories;
      });
    } else {
      this.router.navigate(['member']);
    }
  }

  addItemCallback(status: 'ok' | 'cancel') {
    this.showItemModal = false;
    if (status === 'ok') {
      this.memberService.postItem(this.item).subscribe(
        x => {
          this.model.itens.push(x);
          this.toastService.success('Sucesso', 'Item criado com sucesso!');
        },
        err => this.toastService.error('Erro', 'Houve um erro ao criar o item, tente novamente mais tarde!'),
        () => { }
      );
    }
  }

  canSubmitItem(): boolean {
    return this.item && this.item.validate();
  }

  addItem(): void {
    this.item = new ListItem(null);
    this.showItemModal = true;
  }

  addCategoryCallback(status: 'ok' | 'cancel') {
    this.showCategoryModal = false;
    if (status === 'ok') {
      this.memberService.postCategory({
        id_categoria: 0,
        nome: this.categoryName,
        id_list: this.model.id_list
      }).subscribe(
        x => {
          this.categories.push(x);
          this.toastService.success('Sucesso', 'Categoria criada com sucesso!');
        },
        err => this.toastService.error('Erro', 'Houve um erro ao criar a categoria, tente novamente mais tarde!'),
        () => { }
      );
    }
  }

  canSubmitCategory(): boolean {
    return this.categoryName != null && this.categoryName.replace(/\s/g, '') != '';
  }

  addCategory(): void {
    this.categoryName = null;
    this.showCategoryModal = true;
  }

  removeCategory(e: number): void {
    this.memberService.deleteCategory(e).subscribe(
      x => {
        if (x) {
          const index = this.categories.findIndex(x => x.id_categoria == e);
          if (index >= 0) {
            this.categories.splice(index, 1);
            this.toastService.success('Sucesso', 'Categoria excluida com sucesso!');
          }
        }
      },
      err => this.toastService.error('Erro', 'Ocorreu um erro ao excluir a categoria, tente novamente mais tarde!'),
      () => { });
  }

}
