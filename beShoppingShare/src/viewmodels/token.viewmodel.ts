import { SwaggerType, SwaggerTypes } from '../lib/decorators';

export class Token {

    @SwaggerType(SwaggerTypes.string, 'Bearer xxxxxxxxxxxxxxxxxxxxxxxx')
    public token: string;

}