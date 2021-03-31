import { SwaggerArray, SwaggerType, SwaggerTypes } from "../lib/decorators"
import { ListCategoryRes, ListSimpleRes } from "./list.viewmodel";


export class ItemNotFound {

    @SwaggerType(SwaggerTypes.string,'Item não encontrado.')
    public message: string;
}

export class ItemDeleted {

    @SwaggerType(SwaggerTypes.string,'Item excluído.')
    public message: string;
}

export class ItemPostBody {

    @SwaggerType(SwaggerTypes.number,1)
    public listId: number;

    @SwaggerType(SwaggerTypes.string,'Banana')
    public name: string;

    @SwaggerType(SwaggerTypes.string,'Plantation')
    public description: string;

    @SwaggerType(SwaggerTypes.number,'6.22')
    public value: number;

    @SwaggerType(SwaggerTypes.number,'1.33')
    public weight: number;

    @SwaggerType(SwaggerTypes.string,'kg')
    public unit: string;

    @SwaggerType(SwaggerTypes.number,1)
    public categoryId: number;

}

export class ItemPostRes {

    @SwaggerType(SwaggerTypes.number,1)
    public id: number

    @SwaggerType(SwaggerTypes.string,'Banana')
    public name: string

    @SwaggerType(SwaggerTypes.string,'Platation')
    public description: string

    @SwaggerType(SwaggerTypes.number,6.22)
    public value: number

    @SwaggerType(SwaggerTypes.number,1.34)
    public weight: number

    @SwaggerType(SwaggerTypes.string,'kg')
    public unit: string

    @SwaggerType(SwaggerTypes.number,1)
    public listId: number;

    @SwaggerType(SwaggerTypes.number,1)
    public categoryId: number

    @SwaggerType(SwaggerTypes.date)
    public createdAt: Date

    @SwaggerType(SwaggerTypes.date)
    public updatedAt: Date

}


export class ItemShareRes {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number;

    @SwaggerType(SwaggerTypes.number, 6.36)
    public value: number;

    @SwaggerType(SwaggerTypes.number, 1.22)
    public weight: number;

    @SwaggerType(SwaggerTypes.string,'kg')
    public unit: string;

}

export class ItemGetRes {

    @SwaggerType(SwaggerTypes.number,1)
    public id: number

    @SwaggerType(SwaggerTypes.string,'Banana')
    public name: string

    @SwaggerType(SwaggerTypes.string,'Platation')
    public description: string

    @SwaggerType(SwaggerTypes.number,6.22)
    public value: number

    @SwaggerType(SwaggerTypes.number,1.34)
    public weight: number

    @SwaggerType(SwaggerTypes.string,'kg')
    public unit: string

    @SwaggerType(SwaggerTypes.object,null,null,ListSimpleRes)
    public list: ListSimpleRes;

    @SwaggerType(SwaggerTypes.object,null,null,ListCategoryRes)
    public category: ListCategoryRes

    @SwaggerArray('ItemShareRes')
    public share: ItemShareRes

    @SwaggerType(SwaggerTypes.date)
    public createdAt: Date

    @SwaggerType(SwaggerTypes.date)
    public updatedAt: Date

}


export class ItemPutBody {

    @SwaggerType(SwaggerTypes.number,1)
    public id: number

    @SwaggerType(SwaggerTypes.string,'Banana')
    public name: string

    @SwaggerType(SwaggerTypes.string,'Platation')
    public description: string

    @SwaggerType(SwaggerTypes.number,6.22)
    public value: number

    @SwaggerType(SwaggerTypes.number,1.34)
    public weight: number

    @SwaggerType(SwaggerTypes.string,'kg')
    public unit: string

    @SwaggerType(SwaggerTypes.number,1)
    public categoryId: number

}
