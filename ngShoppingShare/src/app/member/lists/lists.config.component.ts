import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { Category } from "@app/models/category.model";
import { CategoryTemplate } from "@app/models/categoryTemplate.model";
import { Item } from "@app/models/item.model";
import { List } from "@app/models/list.model";
import { ToastService } from "@app/shared/services/toast.service";
import { faMoneyBillWave, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { MemberService } from "../member.service";

@Component({
  templateUrl: 'lists.config.component.html',
  styleUrls: ['lists.config.component.scss']
})
export class ListsConfigComponent implements OnInit {

  public xIcon = faTimes;
  public plusIcon = faPlus;
  public moneyIcon = faMoneyBillWave;

  public showCategoryModal: boolean = false;
  public categoryName: string = null;

  public showItemModal: boolean = false;
  public item: Item = null;
  public selectedCategory: any = null;

  public showShareModal: boolean = false;
  public shareEmail: string = null;

  public model: List = new List();
  public categories: Category[];
  public userCategories: CategoryTemplate[];

  public get allCategories(): any[] {
    if (!this.categories || !this.userCategories) return [];
    let result = [];
    this.categories.forEach(x => result.push({ id: x.id, name: x.name, from: 'list' }));
    this.userCategories.forEach(x => result.push({ id: x.id, name: x.name, from: 'user' }));
    return result;
  }

  constructor(
    private memberService: MemberService,
    private router: Router,
    private toastService: ToastService
  ) { }

  getListItems(): Item[] {
    return this.model.item;
  }

  ngOnInit() {
    if (history.state.id_list && history.state.id_list > 0) {
      this.memberService.getListById(history.state.id_list).subscribe(x => {
        this.model = x;
        console.log(x);
      });
      this.memberService.getCategory(history.state.id_list).subscribe(x => {
        this.categories = x;
      });
      this.memberService.getUserCategory(history.state.id_list).subscribe(x => {
        this.userCategories = x;
      })
    } else {
      this.router.navigate(['member']);
    }
  }

  shareListCallback(status: 'ok' | 'cancel') {
    this.showShareModal = false;
    if (status === 'ok') {
      this.memberService.share({
        email: this.shareEmail,
        listId: this.model.id
      }).subscribe(
        x => {
          this.toastService.success('Sucesso', 'Lista compartilhada com sucesso!');
        },
        err => {
          if (err.error?.message != null) this.toastService.error('Erro', err.error.message)
          else this.toastService.error('Erro', 'Houve um erro ao compartilhar, tente novamente mais tarde!')
        },
        () => { }
      );
    }
  }

  canSubmitShare(): boolean {
    return this.shareEmail != null && this.shareEmail.replace(/\s*/g, '') != '';
  }

  shareList(): void {
    this.showShareModal = true;
  }

  payItem(e: Item) {
    this.memberService.pay({
      itemId: e.id,
      value: e.value,
      weight: e.weight,
      unit: e.unit
    }).subscribe(
      x => {
        this.toastService.success('Sucesso', 'Item pago com sucesso!');
      },
      err => {
        if (err.error?.message != null) this.toastService.error('Erro', err.error.message)
        else this.toastService.error('Erro', 'Houve um erro ao pagar o item, tente novamente mais tarde!')
      },
      () => { }
    );
  }

  addItemCallback(status: 'ok' | 'cancel') {
    this.showItemModal = false;
    if (status === 'ok') {
      const cat = JSON.parse(this.selectedCategory);
      if (cat.from == 'user') {
        this.memberService.postCategory({
          name: cat.name,
          listId: this.model.id
        }).subscribe(
          x => {
            this.categories.push(x);

            this.memberService.postItem(this.item, this.model.id, x.id).subscribe(
              x => {
                this.model.item.push(x);
                this.toastService.success('Sucesso', 'Item criado com sucesso!');
              },
              err => this.toastService.error('Erro', 'Houve um erro ao criar o item, tente novamente mais tarde!'),
              () => { }
            );
          },
          err => this.toastService.error('Erro', 'Houve um erro ao criar a categoria, tente novamente mais tarde!'),
          () => { }
        );
      } else if (cat.from == 'list') {
        this.memberService.postItem(this.item, this.model.id, cat.id).subscribe(
          x => {
            this.model.item.push(x);
            this.toastService.success('Sucesso', 'Item criado com sucesso!');
          },
          err => this.toastService.error('Erro', 'Houve um erro ao criar o item, tente novamente mais tarde!'),
          () => { }
        );
      }
    }
  }

  canSubmitItem(): boolean {
    return this.item &&
      this.item.name != null && this.item.name.replace(/\s*/g, '') != '' &&
      this.item.value > 0 && this.item.weight > 0 && this.selectedCategory != null;
  }

  addItem(): void {
    this.item = new Item(null);
    this.selectedCategory = null;
    this.showItemModal = true;
  }

  addCategoryCallback(status: 'ok' | 'cancel') {
    this.showCategoryModal = false;
    if (status === 'ok') {
      this.memberService.postCategory({
        name: this.categoryName,
        listId: this.model.id
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
          const index = this.categories.findIndex(x => x.id == e);
          if (index >= 0) {
            this.categories.splice(index, 1);
            this.toastService.success('Sucesso', 'Categoria excluida com sucesso!');
          }
        }
      },
      err => this.toastService.error('Erro', 'Ocorreu um erro ao excluir a categoria, tente novamente mais tarde!'),
      () => { });
  }

  removeItem(e: number): void {
    this.memberService.deleteItem(e).subscribe(
      x => {
        if (x) {
          const index = this.model.item.findIndex(x => x.id == e);
          if (index >= 0) {
            this.model.item.splice(index, 1);
            this.toastService.success('Sucesso', 'Item excluido com sucesso!');
          }
        }
      },
      err => this.toastService.error('Erro', 'Ocorreu um erro ao excluir o item, tente novamente mais tarde!'),
      () => { });
  }

}
