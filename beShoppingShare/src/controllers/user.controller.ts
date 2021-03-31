import { Request, Response } from 'express';
import { getToken } from '../lib/utils';
import { User } from '../models/user.model';
import { AllowAnonymous, ApiController, BodyType, HttpDelete, HttpGet, HttpPost, HttpPut, ProducesDefaultResponseType, ProducesResponseType, StatusCodes } from '../lib/decorators';
import ActionResult from '../lib/models/actionresult';
import { ControllerBase } from '../lib/models/controllerbase';
import { compare, compareSync, hash, hashSync } from 'bcrypt';
import { SimpleConsoleLogger } from 'typeorm';
import { Login } from '../viewmodels/login.viewmodel';
import { Token } from '../viewmodels/token.viewmodel';
import { UserChangePasswordReq, UserChangePasswordRes, UserDeleted, UserNotFound, UserSignUpBody, UserSimpleReq, UserSimpleRes, UserUnauthorized } from '../viewmodels/user.viewmodel';
import { CategoryTemplate } from '../models/categoryTemplate.model';
import { CategoryTemplateBody, CategoryTemplateDeleted, CategoryTemplateNotFound } from '../viewmodels/categoryTemplate.viewmodel';

@ApiController('/user')
export class UserController extends ControllerBase {

    @HttpPost('/login')
    @AllowAnonymous
    @BodyType(Login)
    @ProducesResponseType(Token, StatusCodes.OK)
    @ProducesResponseType(UserNotFound, StatusCodes.BadRequest)
    @ProducesResponseType(UserUnauthorized,StatusCodes.Unauthorized)
    @ProducesDefaultResponseType
    public async Login(req: Request, res: Response): Promise<ActionResult> {

        const user = new User(req.body);

        if (!user || !user.email || !user.password) {
            return this.badRequest({ message: 'Invalid request' })
        }

        const cone = (await this.connection)
        const userQuery = await cone
            .manager
            .findOne(User, { where: { email: user.email } })

        if (!userQuery) {
            return this.notFound({ message: 'Email não cadastrado.' })
        }
        if (!compareSync(user.password, userQuery.passwordHash)) {
            return this.unauthorized({ message: 'Senha incorreta.' })
        }

        const token = await getToken({
            id: userQuery.id,
            fullName: userQuery.firstName + ' ' + userQuery.lastName,
            email: user.email
        });

        return this.ok({ token: token });

    }

    @HttpPost('/signup')
    @AllowAnonymous
    @BodyType(UserSignUpBody)
    @ProducesResponseType(UserSimpleRes, StatusCodes.OK)
    @ProducesDefaultResponseType
    public async SignUp(req: Request, res: Response): Promise<ActionResult> {

        const user = new User(req.body);

        if (!user.email || !user.password || !user.firstName || !user.lastName) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const cone = (await this.connection)
        const userQuery = await cone
            .manager
            .findOne(User, { where: { email: user.email } })

        if (userQuery) {
            return this.badRequest({ message: 'Email em uso.' })
        }

        user.passwordHash = await hash(user.password, 10);

        await cone
            .getRepository(User)
            .save(user);

        delete user.passwordHash;
        delete user.password;
        delete user.listUser;
        delete user.categoryTemplate;

        return this.ok(user);
    }

    @HttpGet('/{id:number}')
    @ProducesResponseType(User, StatusCodes.OK)
    @ProducesResponseType(UserNotFound, StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async GetById(req: Request, res: Response): Promise<ActionResult> {

        let user = new User(req.params);

        const cone = await this.connection;
        user = await cone
            .manager
            .findOne(User, req.params.id, {
                relations: ['categoryTemplate', 'listUser']
            })

        if (!user) {
            return this.notFound({ message: 'Usuário não encontrado.' })
        }

        delete user.passwordHash;
        delete user.password;

        return this.ok(user)
    }

    @HttpPut('/')
    @BodyType(UserSimpleReq)
    @ProducesResponseType(UserSimpleRes, StatusCodes.OK)
    @ProducesResponseType(UserNotFound, StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async UpdateUser(req: Request, res: Response): Promise<ActionResult> {

        let user = new User(req.body);

        if (!user || !user.id) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const userRepo = (await this.connection).getRepository(User);
        const userQuery = await userRepo
            .createQueryBuilder('user')
            .where('id = :id', { id: user.id })
            .getOne()

        if (!userQuery) {
            return this.notFound({ message: 'Usuário não encontrado.' })
        }

        await userRepo
            .save(user);

        delete user.passwordHash;
        delete user.password;
        delete user.listUser;
        delete user.categoryTemplate;

        return this.ok(user)
    }

    @HttpDelete('/{id:number}')
    @ProducesResponseType(UserDeleted, StatusCodes.OK)
    @ProducesResponseType(UserNotFound, StatusCodes.NotFound)
    public async DeleteUser(req: Request, res: Response): Promise<ActionResult> {

        let user = new User(req.params);

        if (!user || !user.id) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const userRepo = (await this.connection).getRepository(User);
        const userQuery = await userRepo
            .createQueryBuilder('user')
            .where('id = :id', { id: user.id })
            .getOne()

        if (!userQuery) {
            return this.notFound({ message: 'Usuário não encontrado.' })
        }

        await userRepo
            .createQueryBuilder('user')
            .delete()
            .where('id = :id', { id: user.id })
            .execute()

        return this.ok({ message: 'Usuário deletado com sucesso.' })
    }

    @HttpPut('/changepassword/')
    @BodyType(UserChangePasswordReq)
    @ProducesResponseType(UserChangePasswordRes,StatusCodes.OK)
    @ProducesResponseType(UserNotFound,StatusCodes.NotFound)
    @ProducesResponseType(UserUnauthorized,StatusCodes.Unauthorized)
    public async ChangePassword(req: Request, res: Response): Promise<ActionResult> {

        let user = new User(req.body)

        if (!user || !user.email || !user.password || !req.body.passwordNew) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const userRepo = (await this.connection).getRepository(User);
        const userQuery = await userRepo
            .createQueryBuilder('user')
            .where('id = :id OR email = :email', { id: user.id, email: user.email })
            .getOne()

        if (!userQuery) {
            return this.notFound({ message: 'Usuário não encontrado.' })
        }

        if (!compareSync(user.password, userQuery.passwordHash)) {
            return this.unauthorized({ message: 'Senha incorreta.' })
        }

        user.passwordHash = hashSync(req.body.passwordNew, 10);

        await userRepo
            .createQueryBuilder()
            .update(User)
            .set({ passwordHash: user.passwordHash })
            .where('id = :id', { id: userQuery.id })
            .execute();

        delete user.passwordHash;
        delete user.password;

        return this.ok({ message: 'Senha atualizada.' })
    }

    @HttpPost('/category/')
    @BodyType(CategoryTemplateBody)
    @ProducesResponseType(CategoryTemplate,StatusCodes.OK)
    @ProducesResponseType(UserNotFound,StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async PostCategoryList(req: Request, res: Response): Promise<ActionResult> {

        const categoryTemplate = new CategoryTemplate(req.body);

        if (!categoryTemplate || !categoryTemplate.userId || !categoryTemplate.name) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const cone = await this.connection;
        const user: User = await cone
            .manager
            .findOne(User, categoryTemplate)

        if (!user) {return this.notFound({ message: 'Usuário não existe.' })}

        categoryTemplate.user = user;

        await cone
            .getRepository(CategoryTemplate)
            .save(categoryTemplate);

        return this.ok(categoryTemplate)

    }

    @HttpDelete('/category/{id:number}')
    @ProducesResponseType(CategoryTemplateDeleted,StatusCodes.OK)
    @ProducesResponseType(CategoryTemplateNotFound,StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async DeleteCategoryList(req: Request, res: Response): Promise<ActionResult> {

        if (!req.params.id) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        let categoryTemplate = new CategoryTemplate(req.params);

        const cone = await this.connection;
        categoryTemplate = await cone
            .manager
            .findOne(CategoryTemplate, categoryTemplate.id)

        if (!categoryTemplate) {
            return this.notFound({ message: 'Categoria não encontrada.' })
        }

        await cone
            .manager
            .remove(categoryTemplate)

        return this.ok({ message: 'Categoria excluída com sucesso.' })
    }

}