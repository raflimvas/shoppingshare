export function ApiController(route: string) {
    return function (target: any) {
        target.prototype.route = route;
    };
}

export function HttpGet(route: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        descriptor.value.method = 'get'
        descriptor.value.route = route;
    };
}

export function HttpPost(route: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        descriptor.value.method = 'post'
        descriptor.value.route = route;
    };
}

export function HttpPut(route: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        descriptor.value.method = 'put'
        descriptor.value.route = route;
    };
}

export function HttpDelete(route: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        descriptor.value.method = 'delete'
        descriptor.value.route = route;
    };
}