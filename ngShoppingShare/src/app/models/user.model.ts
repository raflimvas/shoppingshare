export class User {
  public id_user: number = 0;
  public nome: string = null;
  public email: string = null;
  public senha: string = null;

  constructor(obj?: any) {
    this.id_user = obj && obj.id_user || 0;
    this.nome = obj && obj.nome || null;
    this.email = obj && obj.email || null;
    this.senha = obj && obj.senha || null;
  }
}
