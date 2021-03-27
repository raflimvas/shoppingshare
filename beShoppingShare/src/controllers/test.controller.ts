import { ApiController, HttpGet } from "../lib/decorators";
import ActionResult from "../lib/models/actionresult";
import { ControllerBase } from "../lib/models/controllerbase";
import { Request } from "express";
import { User } from "src/models/user.model";

@ApiController('/test')
export class TestController extends ControllerBase {

    @HttpGet('/')
    public async Get(req: Request): Promise<ActionResult> {
        const userRepo = (await this.connection).getRepository(User);
        const user = await userRepo.createQueryBuilder('user')
            .where('user.email = :email', { email: 'teste@localhost' })
            .getOne();
        return this.ok({ id: user.id });
    }

}