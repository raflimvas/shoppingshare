import { SwaggerType, SwaggerTypes } from "../lib/decorators";

export class InvalidRequest {
    @SwaggerType(SwaggerTypes.string,'Invalid request.')
    message: string;
}

export class TokenUnauthorized {
    @SwaggerType(SwaggerTypes.string,'Token não enviado ou inválido.')
    message: string;
}