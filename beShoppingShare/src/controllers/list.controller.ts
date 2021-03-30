import { Request, response, Response } from 'express';
import { ApiController, HttpDelete, HttpGet, HttpPost, HttpPut } from '../lib/decorators';
import ActionResult from '../lib/models/actionresult';
import { ControllerBase } from '../lib/models/controllerbase';
import { getTokenObject } from '../lib/utils';
import { CannotExecuteNotConnectedError } from 'typeorm';
import { List } from '../models/list.model';
import { KeyObject } from 'node:crypto';
import { ListUser } from '../models/listUser.model';
import { User } from '../models/user.model';
import { EDESTADDRREQ } from 'node:constants';

@ApiController('/list')
export class ListController extends ControllerBase {

    @HttpGet('/all/')
    public async GetAllLists(req: Request, res: Response): Promise<ActionResult> {
        const userToken = await this.userContext(req);

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

        let userToken: User = await getTokenObject(req.headers.authorization.split(' ')[1]);

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

        let userToken: User = await getTokenObject(req.headers.authorization.split(' ')[1]);

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

        let userToken: User = await getTokenObject(req.headers.authorization.split(' ')[1]);

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

        let userToken: User = await getTokenObject(req.headers.authorization.split(' ')[1]);

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

        let listUser = new ListUser();

        let user: User =<any> { id: 14}
        
        listUser.user = user

        const cone = (await this.connection)
        const listQuery= await cone
            .manager
            .findOne(List,4)

        listQuery.listUsers = listQuery.listUsers ?? []
        listQuery.listUsers.push(listUser);

        await cone
            .getRepository(List)
            .save(listQuery)

        return this.ok(listQuery)
        
        if (!req.body || !req.body.userId || !req.body.listId) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const verify = await cone
            .manager
            .findOne(ListUser, { where: { userId: req.body.userId, listId: req.body.listId } })

        if (verify) {
            return this.unauthorized({ message: 'Usuário já consta na lista.' })
        }

        await cone
            .getRepository(ListUser)
            .save(req.body)

    }

    @HttpDelete('/user/')
    public async DeleteUserList(req: Request, res: Response): Promise<ActionResult> {

        if (!req.body || !req.body.userId || !req.body.listId) {
            return this.badRequest({ message: 'Invalid request.' })
        }

        const cone = (await this.connection)
        const verify = await cone
            .manager
            .findOne(ListUser, { where: { userId: req.body.userId, listId: req.body.listId } })

        if (!verify) {
            return this.unauthorized({ message: 'Usuário não encontrado para a lista.' })
        }

        await cone
            .getRepository(ListUser)
            .createQueryBuilder('lu')
            .delete()
            .where('userId = :userId and listId = :listId', {
                userId: req.body.userId,
                listId: req.body.listId
            })
            .execute()

        return this.ok({message: 'Usuário excluído da lista.'})
    }
}