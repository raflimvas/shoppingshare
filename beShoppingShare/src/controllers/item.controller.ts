import { ControllerBase } from '../lib/models/controllerbase';
import {
    AllowAnonymous,
    ApiController,
    BodyType,
    HttpDelete,
    HttpGet,
    HttpPost,
    HttpPut,
    ProducesDefaultResponseType,
    ProducesResponseType,
    StatusCodes,
} from '../lib/decorators';
import { Request, Response } from 'express';
import ActionResult from '../lib/models/actionresult';
import { Item } from '../models/item.model';
import { List } from '../models/list.model';
import { Category } from '../models/category.model';
import { ListCategoryNotFound, ListNotFound } from '../viewmodels/list.viewmodel';
import { ItemDeleted, ItemGetRes, ItemNotFound, ItemPostBody, ItemPostRes, ItemPutBody } from '../viewmodels/item.viewmodel';
import { InvalidRequest, TokenUnauthorized } from '../viewmodels/common.viewmodel';
import { Share } from 'src/models/share.model';

@ApiController('/item')
export class ItemController extends ControllerBase {

    @HttpPost('/')
    @BodyType(ItemPostBody)
    @ProducesResponseType(ItemPostRes, StatusCodes.OK)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(ListNotFound, StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async PostItem(req: Request, res: Response): Promise<ActionResult> {

        let item = new Item(req.body);
        if (!item || !item.name || !item.listId) { return this.badRequest({ message: 'Invalid request.' }); }

        item.list.id = item.listId; item.category.id = item.categoryId || 0;

        const cone = await this.connection;
        const listCheck = await cone.manager.findOne(List, item.list.id);

        if (!listCheck) { return this.notFound({ message: 'Lista não existe / sem acesso.' }); }

        const categoryCheck = await cone.manager.findOne(
            Category,
            item.category.id
        );

        await cone.getRepository(Item).save(item);

        delete item.list; delete item.category; delete item.share;

        return this.ok(item);
    }

    @HttpPut('/')
    @BodyType(ItemPutBody)
    @ProducesResponseType(ItemPostRes, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesResponseType(ItemNotFound, StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async UpdateItem(req: Request, res: Response): Promise<ActionResult> {

        const item = new Item(req.body);

        if (!item || !item.id || !item.name) { return this.badRequest({ message: 'Invalid request.' }); }

        const cone = await this.connection;
        const itemQuery = await cone
            .manager
            .findOne(Item, item.id, { relations: ['list', 'category'] })

        if (!itemQuery) { return this.notFound({ message: 'Item não encontrado.' }); }

        const categoryQuery = await cone
            .manager
            .findOne(Category, item.categoryId)

        item.category = categoryQuery; item.list = itemQuery.list;

        await cone
            .getRepository(Item)
            .save(item);

        item.categoryId = item.category?.id; item.listId = item.list?.id;
        delete item.category; delete item.list; delete item.share;

        return this.ok(item);
    }

    @HttpGet('/{id:number}')
    @ProducesResponseType(ItemGetRes, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(ItemNotFound, StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async GetItem(req: Request, res: Response): Promise<ActionResult> {

        let item = new Item(req.params);

        const cone = await this.connection
        item = await cone
            .manager
            .findOne(Item, item.id, { relations: ['share', 'list', 'category'] })

        if (!item) { return this.notFound({ message: 'Item não encontrado.' }); }

        delete item.categoryId; delete item.listId; delete item.category.list; delete item.category.item;
        delete item.category.listId; delete item.list.listUser; delete item.list.category; delete item.list.item;

        try {
            item.share.map((x: Share) => {
                delete x.item; delete x.user; delete x.userId; delete x.itemId;
            });
        }
        catch (err) { }

        return this.ok(item);
    }

    @HttpDelete('/{id:number}')
    @ProducesResponseType(ItemDeleted, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(ItemNotFound, StatusCodes.NotFound)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesDefaultResponseType
    public async DeleteItem(req: Request, res: Response): Promise<ActionResult> {
        const item = new Item(req.params);

        if (!item || !item.id) {
            return this.badRequest({ message: 'Invalid request.' });
        }

        const itemRepo = (await this.connection).getRepository(Item);
        const itemQuery = await itemRepo
            .createQueryBuilder('item')
            .where('id = :id', { id: item.id })
            .getOne();

        if (!itemQuery) {
            return this.notFound({ message: 'Item não encontrado.' });
        }

        await itemRepo
            .createQueryBuilder('item')
            .delete()
            .where('id = :id', { id: item.id })
            .execute();

        return this.ok({ message: 'Item excluído.' });
    }
}
