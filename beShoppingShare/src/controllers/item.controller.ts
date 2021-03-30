import { ControllerBase } from "../lib/models/controllerbase";
import { AllowAnonymous, ApiController, HttpPost, HttpPut } from "../lib/decorators";
import { Request, Response } from "express";
import ActionResult from "../lib/models/actionresult";
import { Item } from "../models/item.model";
import { List } from "../models/list.model";
import { Category } from "../models/category.model";

@ApiController('/item')
export class ItemController extends ControllerBase {

    @HttpPost('/')
    @AllowAnonymous
    public async PostItem(req: Request, res: Response): Promise<ActionResult> {

        if (!req.body || !req.body.name || !req.body.list.id) {
            return this.badRequest({ message: "Invalid request." })
        }

        let item = new Item(req.body);
        item.list.id = req.body.listId;
        item.list.id = req.body.categoryId || 0;

        const cone = await this.connection
        const listCheck = await cone
            .manager
            .findOne(List, item.list.id)

        if (!listCheck) {
            return this.notFound({ message: "Lista não encontrada." })
        }

        const categoryCheck = await cone
            .manager
            .findOne(Category, item.category.id);


        item.list = listCheck;

        await cone
            .getRepository(Item)
            .save(item)

        return this.ok(item)

    }

    @HttpPut('/')
    @AllowAnonymous
    public async UpdateItem(req: Request, res: Response): Promise<ActionResult> {

        return this.ok({})
    }

}