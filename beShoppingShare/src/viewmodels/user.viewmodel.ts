import { SwaggerType, SwaggerTypes } from '../lib/decorators';

export class UserNotFound {

    @SwaggerType(SwaggerTypes.string,'Usuário não encontrado.')
    public message: string;

}

export class UserDeleted {

    @SwaggerType(SwaggerTypes.string,'Usuário deletado com sucesso.')
    public message: string;

}

export class UserUnauthorized {

    @SwaggerType(SwaggerTypes.string,'Senha incorreta.')
    public message: string;

}

export class UserSignUpBody {

    @SwaggerType(SwaggerTypes.string, 'End')
    public firstName: string;

    @SwaggerType(SwaggerTypes.string, 'Game')
    public lastName: string;

    @SwaggerType(SwaggerTypes.email)
    public email: string;

    @SwaggerType(SwaggerTypes.password)
    public password: string;
}

export class UserSimpleRes {

    @SwaggerType(SwaggerTypes.number,1)
    public id: number;

    @SwaggerType(SwaggerTypes.email)
    public email: string;

    @SwaggerType(SwaggerTypes.string,'End')
    public firstName: string;

    @SwaggerType(SwaggerTypes.string,'Game')
    public lastName: string;

    @SwaggerType(SwaggerTypes.date)
    public createdAt: Date

    @SwaggerType(SwaggerTypes.date)
    public updatedAt: Date

}


export class UserSimpleReq {

    @SwaggerType(SwaggerTypes.number,1)
    public id: number;

    @SwaggerType(SwaggerTypes.email)
    public email: string;

    @SwaggerType(SwaggerTypes.string,'End')
    public firstName: string;

    @SwaggerType(SwaggerTypes.string,'Game')
    public lastName: string;

}

export class UserChangePasswordReq {

    @SwaggerType(SwaggerTypes.email)
    public email: string;

    @SwaggerType(SwaggerTypes.password)
    public password: string;

    @SwaggerType(SwaggerTypes.password,'Passw0rd#')
    public PasswordNew: string;

}

export class UserChangePasswordRes {

    @SwaggerType(SwaggerTypes.string, 'Senha atualizada.')
    public message: string;

}

export class UserToken {

    @SwaggerType(SwaggerTypes.number, 1)
    public id: number;

    @SwaggerType(SwaggerTypes.string, 'EndGame')
    public fullName: string;

}