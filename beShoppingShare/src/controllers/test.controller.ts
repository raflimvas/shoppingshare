import { AllowAnonymous, ApiController, BodyType, HttpGet, HttpPost, ProducesDefaultResponseType, ProducesResponseType, StatusCodes } from '../lib/decorators';
import ActionResult from '../lib/models/actionresult';
import { ControllerBase } from '../lib/models/controllerbase';
import { Request } from 'express';
import { User } from '../models/user.model';

@ApiController('/test')
export class TestController extends ControllerBase {

    @HttpPost('/', 'sumario teste', 'descricao teste')
    @BodyType(User)
    @ProducesResponseType(User, StatusCodes.OK, 'Teste de retorno')
    @ProducesDefaultResponseType
    public async Post(req: Request): Promise<ActionResult> {
        //const userRepo = (await this.connection).getRepository(User);
        /*const user = await userRepo.createQueryBuilder('user')
            .where('user.email = :email', { email: 'teste@localhost' })
            .getOne();*/
        return this.ok({ id: 2 });
    }

    @HttpGet('/get/{id:number}/{userid:string}', 'sumario teste', 'descricao teste')
    @ProducesResponseType(User, StatusCodes.OK, 'Teste de retorno')
    @ProducesDefaultResponseType
    public async Get(req: Request): Promise<ActionResult> {
        return this.ok({ id: 2 });
    }

}