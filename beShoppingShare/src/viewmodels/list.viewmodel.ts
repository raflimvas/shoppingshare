import { ListUser } from '../models/listUser.model';
import { SwaggerArray, SwaggerType, SwaggerTypes } from '../lib/decorators';
import { UserToken } from './user.viewmodel';
import { List } from '../models/list.model';
import { User } from '../models/user.model';

export class ListSimpleReq {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number;

    @SwaggerType(SwaggerTypes.string, 'EndList')
    public name: string

    @SwaggerType(SwaggerTypes.string, 'Final EndList')
    public description: string;

}

export class ListNotFound {

    @SwaggerType(SwaggerTypes.string, 'Lista não existe / sem acesso.')
    public message: string;
}

export class ListAllList {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number;

    @SwaggerType(SwaggerTypes.string, 'EndList')
    public name: string;

    @SwaggerType(SwaggerTypes.string, 'EndGame final List')
    public description: string;

    @SwaggerType(SwaggerTypes.boolean, true)
    public owner: boolean;

    @SwaggerType(SwaggerTypes.date)
    public createdAt: Date;

    @SwaggerType(SwaggerTypes.date)
    public updatedAt: Date;

}

export class ListAllResponse {

    @SwaggerType(SwaggerTypes.object, null, null, UserToken)
    public user: UserToken;

    @SwaggerArray('ListAllList')
    public lists: ListAllList;
}

export class ListNameBody {

    @SwaggerType(SwaggerTypes.string, 'EndList')
    public name: string;

    @SwaggerType(SwaggerTypes.string, 'Final EndList')
    public description: string;

}

export class ListPostListUser {

    @SwaggerType(SwaggerTypes.number, 1)
    public userId: number;

    @SwaggerType(SwaggerTypes.boolean, true)
    public owner: boolean;

    @SwaggerType(SwaggerTypes.date)
    public createdAt: Date;

    @SwaggerType(SwaggerTypes.date)
    public updatedAt: Date;
}

export class ListItemRes {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number

    @SwaggerType(SwaggerTypes.string, 'Banana')
    public name: string

    @SwaggerType(SwaggerTypes.string, 'Plantation')
    public description: string

    @SwaggerType(SwaggerTypes.number, '6.22')
    public value: number

    @SwaggerType(SwaggerTypes.number, '1.350')
    public weight: number

    @SwaggerType(SwaggerTypes.string, 'kg')
    public unit: string

    @SwaggerType(SwaggerTypes.date)
    public createdAt: Date;

    @SwaggerType(SwaggerTypes.date)
    public updatedAt: Date;
}

export class ListCategoryRes {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number;

    @SwaggerType(SwaggerTypes.string, 'Hortifruti')
    public name: string;
}

export class ListFullRes {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number;

    @SwaggerType(SwaggerTypes.string, 'EndList')
    public name: string

    @SwaggerType(SwaggerTypes.string, 'Final EndList')
    public description: string;

    @SwaggerArray('ListPostListUser')
    public listUser: ListPostListUser

    @SwaggerArray('ListItemRes')
    public item: ListItemRes

    @SwaggerArray('ListCategoryRes')
    public category: ListCategoryRes

    @SwaggerType(SwaggerTypes.date)
    public createdAt: Date;

    @SwaggerType(SwaggerTypes.date)
    public updatedAt: Date;

}

export class ListSimpleRes {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number;

    @SwaggerType(SwaggerTypes.string, 'EndList')
    public name: string

    @SwaggerType(SwaggerTypes.string, 'Final EndList')
    public description: string;

    @SwaggerType(SwaggerTypes.date)
    public createdAt: Date;

    @SwaggerType(SwaggerTypes.date)
    public updatedAt: Date;

}

export class ListDeleted {

    @SwaggerType(SwaggerTypes.string, 'Lista excluída.')
    public message: string;
}

export class ListUserInList {

    @SwaggerType(SwaggerTypes.string, 'Usuário já consta na lista.')
    public message: string;

}

export class ListUserPostBody {

    @SwaggerType(SwaggerTypes.number, 1)
    public userId: number;

    @SwaggerType(SwaggerTypes.number, 1)
    public listId: number;

}

export class ListUserPostRes {

    @SwaggerType(SwaggerTypes.object, null, null, User)
    public user: User

    @SwaggerType(SwaggerTypes.object, null, null, List)
    public list: List

    @SwaggerType(SwaggerTypes.boolean, true)
    public owner: boolean

    @SwaggerType(SwaggerTypes.date)
    public createdAt: Date

    @SwaggerType(SwaggerTypes.date)
    public updatedAt: Date

}

export class ListUserDeleted {

    @SwaggerType(SwaggerTypes.string, 'Usuário excluído da lista.')
    public message: string
}

export class ListCategoryBody {

    @SwaggerType(SwaggerTypes.number, 1)
    public listId: number

    @SwaggerType(SwaggerTypes.string, 'Hortifruti')
    public name: string

}

export class ListCategoryPostRes {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number

    @SwaggerType(SwaggerTypes.string, 'Hortifruti')
    public name: string

    @SwaggerType(SwaggerTypes.number, 1)
    public listId: number

}

export class ListCategoryNotFound {

    @SwaggerType(SwaggerTypes.string, 'Categoria não encontrada.')
    public message: string

}

export class ListCategoryDeleted {

    @SwaggerType(SwaggerTypes.string, 'Categoria excluída com sucesso.')
    public message: string

}