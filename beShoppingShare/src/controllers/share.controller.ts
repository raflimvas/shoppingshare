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
import { Share } from '../models/share.model';
import { User } from '../models/user.model';
import { Item } from '../models/item.model';
import { InvalidRequest, TokenUnauthorized } from '../viewmodels/common.viewmodel';
import { UserNotFound } from '../viewmodels/user.viewmodel';
import { ItemNotFound } from '../viewmodels/item.viewmodel';
import { ShareDeleted, ShareFull, ShareNotFound, SharePostBody, ShareSimple } from '../viewmodels/share.viewmodel';
import { getTokenObject } from '../lib/utils';

@ApiController('/share')
export class ShareController extends ControllerBase {

    @HttpPost('/')
    @BodyType(SharePostBody)
    @ProducesResponseType(ShareSimple, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(UserNotFound, StatusCodes.NotFound)
    @ProducesResponseType(ItemNotFound, StatusCodes.NotFound)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesDefaultResponseType
    public async PostShare(req: Request, res: Response): Promise<ActionResult> {

        const share = new Share(req.body);
        let userToken: User = await getTokenObject(req.headers.authorization);

        if (!userToken) { return this.unauthorized({ message: 'Token não enviado ou inválido.' }) }

        if (!share || !req.body.itemId || !share.weight) { return this.badRequest({ message: 'Invalid request.' }); }

        share.user.id = userToken.id || 0;
        share.item.id = req.body.itemId || 0;

        const cone = await this.connection;
        const usuario = await cone.manager.findOne(User, share.user.id);
        if (!usuario) { return this.notFound({ message: 'Usuário não encontrado.' }); }

        const item = await cone.manager.findOne(Item, share.item.id);
        if (!item) { return this.notFound({ message: 'Item não encontrada.' }); }

        share.user = usuario; share.item = item;

        await cone.getRepository(Share).save(share);

        delete share.user; delete share.item;

        return this.ok(share);

    }

    @HttpPut('/')
    @BodyType(ShareSimple)
    @ProducesResponseType(ShareFull, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(ShareNotFound, StatusCodes.NotFound)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesDefaultResponseType
    public async UpdateShare(req: Request, res: Response): Promise<ActionResult> {

        const share = new Share(req.body);
        let userToken: User = await getTokenObject(req.headers.authorization);

        if (!userToken) { return this.unauthorized({ message: 'Token não enviado ou inválido.' }) }

        if (!share || !share.id) { return this.badRequest({ message: 'Invalid request.' }); }

        const cone = await this.connection
        const shareQuery = await cone
            .manager
            .findOne(Share, share.id, { relations: ['item', 'user'] })

        if (!shareQuery) { return this.notFound({ message: 'Contribuição não encontrada.' }); }
        share.item = shareQuery.item; share.user = shareQuery.user;
        shareQuery.value = share.value;
        shareQuery.weight = share.weight;

        await cone.getRepository(Share).save(shareQuery);

        delete share.userId; delete share.itemId; delete share.item.categoryId; delete share.item.listId;
        delete share.item.list; delete share.item.category; delete share.item.share;
        delete share.user.categoryTemplate; delete share.user.listUser; delete share.user.password; delete share.user.passwordHash;

        return this.ok(share);
    }

    @HttpGet('/{id:number}')
    @ProducesResponseType(ShareFull, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(ShareNotFound, StatusCodes.NotFound)
    @ProducesDefaultResponseType
    public async GetShare(req: Request, res: Response): Promise<ActionResult> {

        let share = new Share(req.params);

        const cone = await this.connection
        share = await cone
            .manager
            .findOne(Share, share.id, { relations: ['user', 'item'] })

        if (!share) { return this.notFound({ message: 'Contribuição não encontrada.' }); }

        delete share.userId; delete share.itemId;
        delete share.item.list; delete share.item.category; delete share.item.share;
        delete share.user.categoryTemplate; delete share.user.listUser; delete share.user.password; delete share.user.passwordHash;

        return this.ok(share);
    }

    @HttpDelete('/{id:number}')
    @ProducesResponseType(ShareDeleted, StatusCodes.OK)
    @ProducesResponseType(TokenUnauthorized, StatusCodes.Unauthorized)
    @ProducesResponseType(ShareNotFound, StatusCodes.NotFound)
    @ProducesResponseType(InvalidRequest, StatusCodes.BadRequest)
    @ProducesDefaultResponseType
    public async DeleteItem(req: Request, res: Response): Promise<ActionResult> {

        const share = new Share(req.params);

        if (!share || !share.id) { return this.badRequest({ message: 'Invalid request.' }); }

        const cone = await this.connection
        const shareQuery = await cone
            .manager
            .findOne(Share, share.id);

        if (!shareQuery) { return this.notFound({ message: 'Contribuição não encontrada.' }); }

        await cone
            .getRepository(Share)
            .createQueryBuilder('share')
            .delete()
            .where('id = :id', { id: share.id })
            .execute();

        return this.ok({ message: 'Contribuição excluída.' });
    }
}
