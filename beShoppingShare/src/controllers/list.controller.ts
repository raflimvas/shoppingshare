import { Request, response, Response } from 'express';
import { AllowAnonymous, ApiController, BodyType, HttpDelete, HttpGet, HttpPost, HttpPut, ProducesDefaultResponseType, ProducesResponseArray, ProducesResponseType, StatusCodes } from '../lib/decorators';
import ActionResult from '../lib/models/actionresult';
import { ControllerBase } from '../lib/models/controllerbase';
import { getTokenObject } from '../lib/utils';
import { CannotExecuteNotConnectedError } from 'typeorm';
import { List } from '../models/list.model';
import { ListUser } from '../models/listUser.model';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { Item } from '../models/item.model';
import { ListAllResponse, ListCategoryBody, ListCategoryDeleted, ListCategoryNotFound, ListCategoryPostRes, ListFullRes, ListNameBody, ListNotFound, ListSimpleRes, ListUserDeleted, ListUserInList, ListUserPostBody, ListUserPostRes } from '../viewmodels/list.viewmodel';
import { connect } from 'node:http2';
import { InvalidRequest, TokenUnauthorized } from '../viewmodels/common.viewmodel';
import { UserNotFound } from '../viewmodels/user.viewmodel';

@ApiController('/list')
export class ListController extends ControllerBase {

    @HttpGet('/all/')
    @ProducesResponseType(ListAllResponse, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesDefaultResponseType
    public async GetAllLists(req: Request, res: Response): Promise<ActionResult> {

        let userToken: User = await getTokenObject(req.headers.authorization);
        if (!userToken) { return this.unauthorized({ message: 'Token não enviado ou inválido.' }) }

        const cone = (await this.connection)
        const listQuery = await cone
            .manager
            .query('SELECT * FROM list A INNER JOIN list_user b ON A.id = b.listId AND b.userId = ' + userToken.id)

        return this.ok({
            user: userToken,
            lists: listQuery.map((x: any) => {
                return {
                    id: x.listId,
                    name: x.name,
                    description: x.description,
                    owner: x.owner,
                    createdAt: x.createdAt,
                    updatedAt: x.updatedAt
                };
            })
        });
    }

    @HttpPost('/')
    @BodyType(ListNameBody)
    @ProducesResponseType(ListFullRes, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesDefaultResponseType
    public async PostList(req: Request, res: Response): Promise<ActionResult> {

        let userToken: User = await getTokenObject(req.headers.authorization);
        let list = new List(req.body);
        let listUser = new ListUser();

        if (!userToken) { return this.unauthorized({ message: 'Token não enviado ou inválido.' }); }
        if (!list || !list.name) { return this.badRequest({ message: 'Invalid request.' }); }

        const cone = await this.connection
        const listQuery = await cone
            .getRepository(List)
            .save(list);

        listUser.list = list; listUser.user = userToken; listUser.owner = true;

        listUser = await cone
            .getRepository(ListUser)
            .save(listUser);

        const cone2 = await this.connection
        list = await cone
            .manager
            .findOne(List, listUser.list.id, { relations: ['listUser'] });

        list.listUser[0].userId = listUser.user.id; list.listUser[0].listId = listUser.list.id;
        delete list.listUser[0].user; delete list.listUser[0].list; delete list.item; delete list.category;

        return this.ok(list);
    }

    @HttpGet('/{id:number}')
    @ProducesResponseType(ListFullRes, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(ListNotFound, StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async GetListById(req: Request, res: Response): Promise<ActionResult> {

        let userToken: User = await getTokenObject(req.headers.authorization);

        if (!userToken) {
            return this.unauthorized({ message: 'Token não enviado ou inválido.' })
        }

        let list = new List(req.params);
        const listUserRepo = (await this.connection).getRepository(ListUser);
        const listUserVerify = await listUserRepo
            .createQueryBuilder('lu')
            .where('lu.userId = :userId and lu.listId = :listId', {
                userId: userToken.id,
                listId: list.id
            })
            .getOne()

        if (!listUserVerify) { return this.notFound({ message: 'Lista não existe / Sem acesso.' }); }

        const cone = (await this.connection);
        list = await cone
            .manager
            .findOne(List, list.id, { relations: ['item', 'category', 'listUser'] })

        try {
            list.category.map((x: Category) => {
                delete x.item; delete x.list; delete x.listId;
            });
        }
        catch (err) { }

        try {
            list.item.map((x: Item) => {
                delete x.list; delete x.listId; delete x.categoryId; delete x.share;
            });
        }
        catch (err) { }

        try {
            list.listUser.map((x: ListUser) => {
                x.userId = userToken.id;
                delete x.list; delete x.listId; delete x.user;
            });
        }
        catch (err) { }

        return this.ok(list);

    }

    @HttpPut('/')
    @ProducesResponseType(ListSimpleRes, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesResponseType(ListNotFound, StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async UpdateList(req: Request, res: Response): Promise<ActionResult> {

        let userToken: User = await getTokenObject(req.headers.authorization);

        if (!userToken) { return this.unauthorized({ message: 'Token não enviado ou inválido.' }) }

        let list = new List(req.body);

        if (!list || !list.id) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const listUserRepo = (await this.connection).getRepository(ListUser);
        const listUserVerify = await listUserRepo
            .createQueryBuilder('lu')
            .where('lu.userId = :userId and lu.listId = :listId', {
                userId: userToken.id,
                listId: list.id
            })
            .getOne()

        if (!listUserVerify) {
            return this.notFound({ message: 'Lista não existe / Sem acesso.' })
        }

        const listRepo = (await this.connection).getRepository(List);
        await listRepo
            .save(list)

        delete list.listUser; delete list.category; delete list.item;

        return this.ok(list);
    }

    @HttpDelete('/{id:number}')
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesResponseType(ListNotFound, StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async DeleteList(req: Request, res: Response): Promise<ActionResult> {

        let userToken: User = await getTokenObject(req.headers.authorization);

        if (!userToken) {
            return this.unauthorized({ message: 'Token não enviado ou inválido.' })
        }

        let list = new List(req.params);

        if (!list || !list.id) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const listUserRepo = (await this.connection).getRepository(ListUser);
        const listUserVerify = await listUserRepo
            .createQueryBuilder('lu')
            .where('lu.userId = :userId and lu.listId = :listId', {
                userId: userToken.id,
                listId: list.id
            })
            .getOne();

        if (!listUserVerify) { return this.notFound({ message: 'Lista não existe / Sem acesso.' }) }

        const listRepo = (await this.connection).getRepository(List);
        const listDel = await listRepo
            .createQueryBuilder('list')
            .delete()
            .where('id = :id', { id: list.id })
            .execute()

        return this.ok({ message: 'Lista excluída.' });

    }

    @HttpPost('/user/')
    @BodyType(ListUserPostBody)
    @ProducesResponseType(ListUserPostRes, StatusCodes.OK)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesResponseType(ListNotFound, StatusCodes.NotFound)
    @ProducesResponseType(ListUserInList, StatusCodes.Unauthorized)
    @ProducesDefaultResponseType
    public async PostUserList(req: Request, res: Response): Promise<ActionResult> {

        if (!req.body || !req.body.userId || !req.body.listId) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        let listUser = new ListUser();

        const cone = (await this.connection)
        const user: User = await cone
            .manager
            .findOne(User, req.body.userId)

        if (!user) { return this.notFound({ message: 'Usuário não encontrado.' }) }

        const list: List = await cone
            .manager
            .findOne(List, req.body.listId)

        if (!list) { return this.notFound({ message: 'Lista não existe / Sem acesso.' }) }

        listUser.user = user; listUser.list = list; listUser.owner = false;

        const verify = await cone
            .manager
            .findOne(ListUser, { where: { user: user, list: list } })

        if (verify) { return this.unauthorized({ message: 'Usuário já consta na lista.' }) }

        await cone
            .getRepository(ListUser)
            .save(listUser)

        return this.ok(listUser)

    }


    @HttpDelete('/user/{userId:number}/{listId:number}')
    @ProducesResponseType(ListUserDeleted, StatusCodes.OK)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesResponseType(UserNotFound, StatusCodes.NotFound)
    @ProducesResponseType(ListUserInList, StatusCodes.Unauthorized)
    @ProducesDefaultResponseType
    public async DeleteUserList(req: Request, res: Response): Promise<ActionResult> {

        if (!req.params.userId || !req.params.listId) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        let listUser = new ListUser();

        const cone = (await this.connection)
        const user: User = await cone
            .manager
            .findOne(User, req.params.userId)

        const list: List = await cone
            .manager
            .findOne(List, req.params.listId)

        listUser.user = user;
        listUser.list = list;

        console.log(listUser);

        const verify = await cone
            .manager
            .findOne(ListUser, { where: { user: listUser.user, list: listUser.list } })

        if (!verify) {
            return this.unauthorized({ message: 'Usuário não encontrado.' })
        }

        await cone
            .getRepository(ListUser)
            .createQueryBuilder('lu')
            .delete()
            .where('userId = :userId and listId = :listId', {
                userId: listUser.user.id,
                listId: listUser.list.id
            })
            .execute()

        return this.ok({ message: 'Usuário excluído da lista.' })
    }

    @HttpPost('/category/')
    @BodyType(ListCategoryBody)
    @ProducesResponseType(ListCategoryPostRes, StatusCodes.OK)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesResponseType(ListNotFound, StatusCodes.NotFound)
    @ProducesResponseType(ListUserInList, StatusCodes.Unauthorized)
    @ProducesDefaultResponseType
    public async PostCategoryList(req: Request, res: Response): Promise<ActionResult> {

        const category = new Category(req.body);

        if (!req.body || !req.body.listId || !req.body.name) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const cone = await this.connection;
        const list: List = await cone
            .manager
            .findOne(List, req.body.listId)

        if (!list) {
            return this.notFound({ message: 'Lista não existe / sem acesso.' })
        }

        category.list = list;

        await cone
            .getRepository(Category)
            .save(category);

        delete category.list; delete category.item;

        return this.ok(category)

    }

    @HttpDelete('/category/{id:number}')
    @ProducesResponseType(ListCategoryDeleted, StatusCodes.OK)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesResponseType(ListCategoryNotFound, StatusCodes.NotFound)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesDefaultResponseType
    public async DeleteCategoryList(req: Request, res: Response): Promise<ActionResult> {

        if (!req.params.id) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        let category = new Category(req.params);

        const cone = await this.connection;
        category = await cone
            .manager
            .findOne(Category, category.id)

        if (!category) {
            return this.notFound({ message: 'Categoria não encontrada.' })
        }

        await cone
            .manager
            .remove(category)

        return this.ok({ message: 'Categoria excluída com sucesso.' })
    }

}