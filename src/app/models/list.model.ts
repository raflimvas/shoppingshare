export class List {
  public id: number = 0;
  public nome: string = null;
  public descricao: string = null;
  public itens: ListItem[] = [];

  constructor(obj?: any) {
    this.id = obj && obj.id || 0;
    this.id = obj && obj.id_list || this.id;
    this.nome = obj && obj.nome || null;
    this.descricao = obj && obj.descricao || null;
    this.itens = [];
    if (obj && obj.itens) {
      this.itens = Array.isArray(obj.itens) ? obj.itens.map(x => new ListItem(x)) : [];
    }
  }
}

export class ListItem {
  public id: number = 0;
  public nome: string = null;
  public descricao: string = null;

  constructor(obj?: any) {
    this.id = obj && obj.id || 0;
    this.nome = obj && obj.nome || null;
    this.descricao = obj && obj.descricao || null;
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
