import { SwaggerType, SwaggerTypes } from "../lib/decorators"; 

export class CategoryTemplateNotFound {

    @SwaggerType(SwaggerTypes.string, 'Categoria não encontrada.')
    public message: string;

}

export class CategoryTemplateDeleted {

    @SwaggerType(SwaggerTypes.string, 'Categoria excluída com sucesso.')
    public message: string;

}

export class CategoryTemplateBody {

    @SwaggerType(SwaggerTypes.number, 1)
    public userId: number;

    @SwaggerType(SwaggerTypes.string, 'Sorvetes')
    public name: string;

}
