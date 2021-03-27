export class List {
  public id_list: number = 0;
  public nome: string = null;
  public descricao: string = null;
  public itens: ListItem[] = [];

  constructor(obj?: any) {
    this.id_list = obj && obj.id_list || 0;
    this.nome = obj && obj.nome || null;
    this.descricao = obj && obj.descricao || null;
    this.itens = [];
    if (obj && obj.itens) {
      this.itens = Array.isArray(obj.itens) ? obj.itens.map(x => new ListItem(x)) : [];
    }
  }
}

export class ListItem {
  public id_item: number = 0;
  public nome: string = null;
  public descricao: string = null;
  public valor: number = 0;
  public massa: number = 0;
  public un_massa: string = null;
  public status: string = null;

  constructor(obj?: any) {
    this.id_item = obj && obj.id_item || 0;
    this.nome = obj && obj.nome || null;
    this.descricao = obj && obj.descricao || null;
    this.valor = obj && obj.valor || 0;
    this.massa = obj && obj.massa || 0;
    this.un_massa = obj && obj.un_massa || null;
    this.status = obj && obj.status || null;
  }

  public validate(): boolean {
    return true;
  }
}

export class Category {
  public id_categoria: number = 0;
  public nome: string = null;
  public id_list: number = 0;

  constructor(obj?: any) {
    this.id_categoria = obj && obj.id_categoria || 0;
    this.nome = obj && obj.nome || null;
    this.id_list = obj && obj.id_list || 0;
  }
}

export class CategoryResult {
  public categories: Category[] = [];

  constructor(obj?: any) {
    this.categories = [];
    if (obj && obj.categories) {
      this.categories = Array.isArray(obj.categories) ? obj.categories.map(x => new Category(x)) : [];
    }
  }
}

export class ListResult {
  public lists: List[] = [];

  constructor(obj?: any) {
    this.lists = [];
    if (obj && obj.lists) {
      this.lists = Array.isArray(obj.lists) ? obj.lists.map(x => new List(x)) : [];
    }
  }
}
