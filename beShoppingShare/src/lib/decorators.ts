export function ApiController(route: string, name?: string) {
    return function (
        target: any
    ) {
        target.prototype.route = route;
        target.prototype.tag = name ?? (<string>target.name).replace(/Controller/g, '');
    };
}

export function AllowAnonymous(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    descriptor.value.anonymous = true;
}

const routeRegex = new RegExp(/{([a-zA-Z]+[a-zA-Z0-9]*):(number|string)+}/g);

export function HttpGet(route: string, summary?: string, description?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const parameters = descriptor.value.swagger?.parameters ?? [];
        if (routeRegex.test(route)) {
            route = route.replace(routeRegex, (v, g1, g2) => {
                parameters.push({
                    in: 'path',
                    name: g1,
                    schema: {
                        type: g2
                    },
                    required: true
                });
                return `:${g1}`;
            });
        }
        
        descriptor.value.method = 'get'
        descriptor.value.route = route;
        descriptor.value.swagger = {
            summary: summary,
            description: description,
            consumes: [],
            produces: ['application/json'],
            requestBody: descriptor.value.swagger?.requestBody,
            parameters: parameters,
            responses: descriptor.value.swagger?.responses
        }
    };
}

export function HttpPost(route: string, summary?: string, description?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const parameters = descriptor.value.swagger?.parameters ?? [];
        if (routeRegex.test(route)) {
            route = route.replace(routeRegex, (v, g1, g2) => {
                parameters.push({
                    in: 'path',
                    name: g1,
                    schema: {
                        type: g2
                    },
                    required: true
                });
                return `:${g1}`;
            });
        }

        descriptor.value.method = 'post'
        descriptor.value.route = route;
        descriptor.value.swagger = {
            summary: summary,
            description: description,
            consumes: ['application/json'],
            produces: ['application/json'],
            requestBody: descriptor.value.swagger?.requestBody,
            parameters: parameters,
            responses: descriptor.value.swagger?.responses
        }
    };
}

export function HttpPut(route: string, summary?: string, description?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const parameters = descriptor.value.swagger?.parameters ?? [];
        if (routeRegex.test(route)) {
            route = route.replace(routeRegex, (v, g1, g2) => {
                parameters.push({
                    in: 'path',
                    name: g1,
                    schema: {
                        type: g2
                    },
                    required: true
                });
                return `:${g1}`;
            });
        }

        descriptor.value.method = 'put'
        descriptor.value.route = route;
        descriptor.value.swagger = {
            summary: summary,
            description: description,
            consumes: ['application/json'],
            produces: ['application/json'],
            requestBody: descriptor.value.swagger?.requestBody,
            parameters: parameters,
            responses: descriptor.value.swagger?.responses
        }
    };
}

export function HttpDelete(route: string, summary?: string, description?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const parameters = descriptor.value.swagger?.parameters ?? [];
        if (routeRegex.test(route)) {
            route = route.replace(routeRegex, (v, g1, g2) => {
                parameters.push({
                    in: 'path',
                    name: g1,
                    schema: {
                        type: g2
                    },
                    required: true
                });
                return `:${g1}`;
            });
        }

        descriptor.value.method = 'delete'
        descriptor.value.route = route;
        descriptor.value.swagger = {
            summary: summary,
            description: description,
            consumes: [],
            produces: ['application/json'],
            requestBody: descriptor.value.swagger?.requestBody,
            parameters: parameters,
            responses: descriptor.value.swagger?.responses
        }
    };
}

export function BodyArray(type: any, description?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (typeof type != 'function') throw 'Invalid type of response type of ' + propertyKey + ' it should be function';
        
        descriptor.value.swagger = {
            summary: descriptor.value.swagger?.summary,
            description: descriptor.value.swagger?.description,
            consumes: descriptor.value.swagger?.consumes,
            produces: descriptor.value.swagger?.produces,
            requestBody: {
                description: description,
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {
                                '$ref': `#/components/schemas/${type.name}`
                            }
                        }
                    }
                }
            },
            parameters: descriptor.value.swagger?.parameters,
            responses: descriptor.value.swagger?.responses
        }
    };
}

export function BodyType(type: any, description?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (typeof type != 'function') throw 'Invalid type of response type of ' + propertyKey + ' it should be function';
        
        descriptor.value.swagger = {
            summary: descriptor.value.swagger?.summary,
            description: descriptor.value.swagger?.description,
            consumes: descriptor.value.swagger?.consumes,
            produces: descriptor.value.swagger?.produces,
            requestBody: {
                description: description,
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            '$ref': `#/components/schemas/${type.name}`
                        }
                    }
                }
            },
            parameters: descriptor.value.swagger?.parameters,
            responses: descriptor.value.swagger?.responses
        }
    };
}

export enum StatusCodes {
    'OK' = 200,
    'Created' = 201,
    'Accepted' = 202,
    'NoContent' = 204,
    'PartialContent' = 206,
    'Found' = 302,
    'NotModified' = 304,
    'BadRequest' = 400,
    'Unauthorized' = 401,
    'Forbidden' = 403,
    'NotFound' = 404,
    'MethodNotAllowed' = 405,
    'NotAcceptable' = 406,
    'RequestTimeout' = 408,
    'Conflict' = 409,
    'Gone' = 410,
    'UnsupportedMediaType' = 415,
    'ImATeapot' = 418,
    'TooManyRequests' = 429,
    'InternalServerError' = 500,
    'NotImplemented' = 501,
    'ServiceUnavailable' = 503
}

export enum SwaggerTypes {
    string, date, password, email, number, boolean, object
}

export const swaggerSchemas: any = {}

export function SwaggerArray(type: string, example?: any, nullable: boolean = false) {
    return function (
        target: any,
        propertyKey: string
    ) {
        const className = (<any>Object.getOwnPropertyDescriptors(target).constructor).value.name;
        swaggerSchemas[className] = swaggerSchemas[className] ?? { type: 'object', properties: {} };

        if (type == null) throw 'Missing type of ' + className + '.' + propertyKey;
        if (typeof type != 'string') throw 'Invalid type of ' + className + '.' + propertyKey + ' it should be string';

        const def: any = {}
        def.type = 'array';
        def.items = {
            '$ref': `#/components/schemas/${type}`
        }

        swaggerSchemas[className].properties[propertyKey] = def;
    };
}

export function SwaggerType(type: SwaggerTypes, example?: any, nullable: boolean = false, subType?: any) {
    return function (
        target: any,
        propertyKey: string
    ) {
        // var t = Reflect.getMetadata("design:type", target, propertyKey);
        const className = (<any>Object.getOwnPropertyDescriptors(target).constructor).value.name;
        swaggerSchemas[className] = swaggerSchemas[className] ?? { type: 'object', properties: {} };
        
        const def: any = {};
        switch (type) {
            case SwaggerTypes.string:
                def.type = 'string';
                break;
            case SwaggerTypes.date:
                def.type = 'string';
                def.format = 'date-time'
                break;
            case SwaggerTypes.password:
                def.type = 'string';
                def.format = 'password';
                def.example = 'Passw0rd!';
                break;
            case SwaggerTypes.email:
                def.type = 'string';
                def.format = 'email';
                break;
            case SwaggerTypes.number:
                def.type = 'number';
                break;
            case SwaggerTypes.boolean:
                def.type = 'boolean';
                break;
            case SwaggerTypes.object:
                if (subType == null) throw 'Missing subType of ' + className + '.' + propertyKey;
                if (typeof subType != 'function') throw 'Invalid subType of ' + className + '.' + propertyKey + ' it should be function';
                def['$ref'] = `#/components/schemas/${subType.name}`
                break;
            default:
                break;
        }

        if (example) def.example = example;
        if (nullable) def.nullable = true;
        
        swaggerSchemas[className].properties[propertyKey] = def;
    };
}

export function ProducesResponseArray(type: any, statusCode: StatusCodes, description?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (typeof type != 'function') throw 'Invalid type of response type of ' + propertyKey + ' it should be function';
        const responses = descriptor.value.swagger?.responses ?? {};
        responses[statusCode] = {
            description: type.name,
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            '$ref': `#/components/schemas/${type.name}`
                        }
                    }
                }
            }
        }

        descriptor.value.swagger = {
            summary: descriptor.value.swagger?.summary,
            description: descriptor.value.swagger?.description,
            consumes: descriptor.value.swagger?.consumes,
            produces: descriptor.value.swagger?.produces,
            requestBody: descriptor.value.swagger?.requestBody,
            parameters: descriptor.value.swagger?.parameters,
            responses: responses
        }
    };
}

export function ProducesResponseType(type: any, statusCode: StatusCodes, description?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (typeof type != 'function') throw 'Invalid type of response type of ' + propertyKey + ' it should be function';
        const responses = descriptor.value.swagger?.responses ?? {};
        responses[statusCode] = {
            description: type.name,
            content: {
                'application/json': {
                    schema: {
                        '$ref': `#/components/schemas/${type.name}`
                    }
                }
            }
        }

        descriptor.value.swagger = {
            summary: descriptor.value.swagger?.summary,
            description: descriptor.value.swagger?.description,
            consumes: descriptor.value.swagger?.consumes,
            produces: descriptor.value.swagger?.produces,
            requestBody: descriptor.value.swagger?.requestBody,
            parameters: descriptor.value.swagger?.parameters,
            responses: responses
        }
    };
}

export function ProducesDefaultResponseType(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const responses = descriptor.value.swagger?.responses ?? {};
    responses['500'] = {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        statusCode: {
                            type: 'number',
                            example: 500
                        },
                        message: {
                            type: 'string',
                            example: 'Erro inesperado'
                        }
                    }
                }
            }          
        }
    }

    descriptor.value.swagger = {
        summary: descriptor.value.swagger?.summary,
        description: descriptor.value.swagger?.description,
        consumes: descriptor.value.swagger?.consumes,
        produces: descriptor.value.swagger?.produces,
        requestBody: descriptor.value.swagger?.requestBody,
        parameters: descriptor.value.swagger?.parameters,
        responses: responses
    }
}