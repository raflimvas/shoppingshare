import { List } from './list.model';
import { User } from './user.model';

export class ListUser {

    public user: User;

    public list: List;

    public owner: boolean;

    constructor(obj?: any) {
      this.user = null;
      if (obj && obj.user) {
        this.user = new User(obj.user);
      }
      this.list = null;
      if (obj && obj.list) {
        this.list = new List(obj.list);
      }
      this.owner = obj && obj.owner || false;
    }
}
