import { SwaggerType, SwaggerTypes } from '../lib/decorators';

export class Login {

    @SwaggerType(SwaggerTypes.email)
    public email: string;

    @SwaggerType(SwaggerTypes.password)
    public password: string;

}