import { Request, response, Response } from "express";
import { AllowAnonymous, ApiController, HttpDelete, HttpGet, HttpPost, HttpPut, ProducesResponseArray, ProducesResponseType, StatusCodes } from "../lib/decorators";
import ActionResult from "../lib/models/actionresult";
import { ControllerBase } from "../lib/models/controllerbase";
import { getTokenObject } from "../lib/utils";
import { CannotExecuteNotConnectedError } from "typeorm";
import { List } from "../models/list.model";
import { ListUser } from "../models/listUser.model";
import { User } from "../models/user.model";
import { Category } from "../models/category.model";

@ApiController('/list')
export class ListController extends ControllerBase {

    @HttpGet('/all/')
    @ProducesResponseArray(List, StatusCodes.OK)
    public async GetAllLists(req: Request, res: Response): Promise<ActionResult> {

        let userToken: User = await getTokenObject(req.headers.authorization);
        if (!userToken) {
            return this.unauthorized({ message: "Token não enviado ou inválido." })
        }

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
    public async PostList(req: Request, res: Response): Promise<ActionResult> {

        let userToken: User = await getTokenObject(req.headers.authorization);

        if (!userToken) {
            return this.unauthorized({ message: 'Token não enviado ou inválido.' })
        }

        let list = new List(req.body);

        if (!list || !list.name) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const listRepo = (await this.connection).getRepository(List)
        const listQuery = await listRepo
            .save(list)

        let listUser = new ListUser(req.body);
        listUser.list = list;
        listUser.user = userToken;
        listUser.owner = true;

        const listUserRepo = (await this.connection).getRepository(ListUser)
        await listUserRepo
            .save(listUser)

        return this.ok({ listUser })
    }

    @HttpGet('/:id')
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

        if (!listUserVerify) {
            return this.notFound({ message: 'Lista não existe / Sem acesso.' })
        }

        const cone = (await this.connection);
        const listQuery = await cone
            .manager
            .findOne(List, list.id, { relations: ['items'] })

        return this.ok(listQuery);

    }


    @HttpPut('/')
    public async UpdateList(req: Request, res: Response): Promise<ActionResult> {

        let userToken: User = await getTokenObject(req.headers.authorization);
        
        if (!userToken) {
            return this.unauthorized({ message: 'Token não enviado ou inválido.' })
        }

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

        return this.ok(list);
    }

    @HttpDelete('/:id')
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
            .getOne()

        if (!listUserVerify) {
            return this.notFound({ message: 'Lista não existe / Sem acesso.' })
        }

        const listRepo = (await this.connection).getRepository(List);
        const listDel = await listRepo
            .createQueryBuilder('list')
            .delete()
            .where('id = :id', { id: list.id })
            .execute()

        return this.ok({ message: 'Lista excluída.' });

    }

    @HttpPost('/user/')
    public async PostUserList(req: Request, res: Response): Promise<ActionResult> {

        if (!req.body || !req.body.userId || !req.body.listId) {
            return this.badRequest({ message: "Invalid request." })
        }

        let listUser = new ListUser();

        const cone = (await this.connection)
        const user: User = await cone
            .manager
            .findOne(User, req.body.userId)

        const list: List = await cone
            .manager
            .findOne(List, req.body.listId)

        listUser.user = user;
        listUser.list = list;
        listUser.owner = false;

        const verify = await cone
            .manager
            .findOne(ListUser, { where: { user: user, list: list } })

        if (verify) {
            return this.unauthorized({ message: 'Usuário já consta na lista.' })
        }

        await cone
            .getRepository(ListUser)
            .save(listUser)

        return this.ok(listUser)

    }


    @HttpDelete('/user/:userId/:listId')
    public async DeleteUserList(req: Request, res: Response): Promise<ActionResult> {

        if (!req.params.userId || !req.params.listId) {
            return this.badRequest({ message: "Invalid request." })
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
            return this.unauthorized({ message: 'Usuário não encontrado para a lista.' })
        }

        await cone
            .getRepository(ListUser)
            .createQueryBuilder('lu')
            .delete()
            .where("userId = :userId and listId = :listId", {
                userId: listUser.user.id,
                listId: listUser.list.id
            })
            .execute()

        return this.ok({ message: "Usuário excluído da lista." })
    }

    @HttpPost('/category/')
    @AllowAnonymous
    public async PostCategoryList(req: Request, res: Response): Promise<ActionResult> {

        const category = new Category(req.body);

        if (!req.body || !req.body.listId || !req.body.name) {
            return this.badRequest({ message: "Invalid request." })
        }

        const cone = await this.connection;
        const list: List = await cone
            .manager
            .findOne(List, req.body.listId)

        if (!list) {
            return this.notFound({ message: "Lista não existe." })
        }

        category.list = list;

        await cone
            .getRepository(Category)
            .save(category);

        return this.ok(category)

    }

    @HttpDelete('/category/:id')
    public async DeleteCategoryList(req: Request, res: Response): Promise<ActionResult> {

        if (!req.params.id) {
            return this.badRequest({ message: "Invalid request." })
        }

        let category = new Category(req.params);

        const cone = await this.connection;
        category = await cone
            .manager
            .findOne(Category, category.id)

        if (!category) {
            return this.notFound({ message: "Categoria não encontrada." })
        }

        await cone
            .manager
            .remove(category)

        return this.ok({ message: "Categoria excluída com sucesso." })
    }

    @HttpGet('/category/:id')
    @AllowAnonymous
    public async GetCategoryFromList(req: Request, res: Response): Promise<ActionResult>{

        if(!req.params){
            return this.badRequest({message: "Invalid request."})
        }

        let list = new List(req.params);
        
        const cone = await this.connection;
        const listQuery = await cone
            .getRepository(List)
            .find({relations: ["categories"],where: {id: list.id}})

        console.log(listQuery);

        return this.ok(listQuery)

    }

}