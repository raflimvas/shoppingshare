import { SwaggerType, SwaggerTypes } from "../lib/decorators";
import { ItemPostRes } from "./item.viewmodel";
import { UserSimpleRes } from "./user.viewmodel";

export class ShareNotFound {

    @SwaggerType(SwaggerTypes.string, 'Contribuição não encontrada.')
    public message: string;
}

export class ShareDeleted {

    @SwaggerType(SwaggerTypes.string, 'Contribuição excluída.')
    public message: string;
}

export class SharePostBody {

    @SwaggerType(SwaggerTypes.number, 1)
    public itemId: number

    @SwaggerType(SwaggerTypes.number, 6.83)
    public value: number

    @SwaggerType(SwaggerTypes.number, 1.24)
    public weight: number

    @SwaggerType(SwaggerTypes.string, 'kg')
    public unit: string

    @SwaggerType(SwaggerTypes.number, 1)
    public userId: number

}

export class ShareSimple {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number;

    @SwaggerType(SwaggerTypes.number, 6.83)
    public value: number;

    @SwaggerType(SwaggerTypes.number, 1.24)
    public weight: number;

    @SwaggerType(SwaggerTypes.string, 'kg')
    public unit: string;

    @SwaggerType(SwaggerTypes.number, 1)
    public itemId: number;

    @SwaggerType(SwaggerTypes.number, 1)
    public userId: number;

}


export class ShareFull {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number;

    @SwaggerType(SwaggerTypes.number, 6.83)
    public value: number;

    @SwaggerType(SwaggerTypes.number, 1.24)
    public weight: number;

    @SwaggerType(SwaggerTypes.string, 'kg')
    public unit: string;

    @SwaggerType(SwaggerTypes.object, null, null, ItemPostRes)
    public item: ItemPostRes;

    @SwaggerType(SwaggerTypes.object, null, null, UserSimpleRes)
    public user: UserSimpleRes;

}