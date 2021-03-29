import { Request, Response } from "express";
import { getToken } from "../lib/utils";
import { User } from "../models/user.model";
import { ApiController, HttpDelete, HttpGet, HttpPost, HttpPut } from "../lib/decorators";
import ActionResult from "../lib/models/actionresult";
import { ControllerBase } from "../lib/models/controllerbase";
import { compare, compareSync, hash, hashSync } from "bcrypt";
import { SimpleConsoleLogger } from "typeorm";

@ApiController('/user')
export class UserController extends ControllerBase {

    @HttpPost('/login')
    public async Login(req: Request, res: Response): Promise<ActionResult> {

        const user = new User(req.body);

        if (!user || !user.email || !user.password) {
            return this.badRequest({ message: "Invalid request" })
        }

        const cone = (await this.connection)
        const userQuery = await cone
            .manager
            .findOne(User,{where: {email: user.email}})

        if (!userQuery) {
            return this.notFound({ message: "Email não cadastrado." })
        }

        if (!compareSync(user.password, userQuery.passwordHash)) {
            return this.unauthorized({ message: "Senha incorreta." })
        }

        let token = await getToken({
            id: userQuery.id,
            fullName: userQuery.firstName + ' ' + userQuery.lastName,
            email: user.email
        });

        return this.ok({ token: token });

    }

    @HttpPost('/signup')
    public async SignUp(req: Request, res: Response): Promise<ActionResult> {

        const user = new User(req.body);

        if (!user.email || !user.password || !user.firstName || !user.lastName) {
            return this.badRequest({ message: "Invalid request." })
        }

        const cone = (await this.connection)
        const userQuery = await cone
            .manager
            .findOne(User,{where: {email: user.email}})

        if (userQuery) {
            return this.badRequest({ message: "Email em uso." })
        }

        user.passwordHash = await hash(user.password, 10);

        await cone
            .getRepository(User)
            .save(user);

        delete user.passwordHash;
        delete user.password;

        return this.ok(user);
    }

    @HttpGet('/:id')
    public async GetById(req: Request, res: Response): Promise<ActionResult> {

        let user = new User(req.params);

        const userRepo = (await this.connection).getRepository(User);
        user = await userRepo
            .createQueryBuilder("user")
            .where("id = :id", { id: req.params.id })
            .getOne()

        if (!user) {
            return this.notFound({ message: "Usuário não encontrado." })
        }

        delete user.passwordHash;
        delete user.password;

        return this.ok(user)
    }

    @HttpPut('/')
    public async UpdateUser(req: Request, res: Response): Promise<ActionResult> {

        let user = new User(req.body);

        if (!user || !user.id) {
            return this.badRequest({ message: "Invalid request." })
        }

        const userRepo = (await this.connection).getRepository(User);
        const userQuery = await userRepo
            .createQueryBuilder("user")
            .where("id = :id", { id: user.id })
            .getOne()

        if (!userQuery) {
            return this.notFound({ message: "Usuário não encontrado." })
        }

        await userRepo
            .save(user);

        delete user.passwordHash;
        delete user.password;

        return this.ok(user)
    }

    @HttpDelete('/:id')
    public async DeleteUser(req: Request, res: Response): Promise<ActionResult> {

        let user = new User(req.params);

        if (!user || !user.id) {
            return this.badRequest({ message: "Invalid request." })
        }

        const userRepo = (await this.connection).getRepository(User);
        const userQuery = await userRepo
            .createQueryBuilder("user")
            .where("id = :id", { id: user.id })
            .getOne()

        if (!userQuery) {
            return this.notFound({ message: "Usuário não encontrado." })
        }

        await userRepo
            .createQueryBuilder("user")
            .delete()
            .where("id = :id", { id: user.id })
            .execute()

        return this.ok({ message: "Usuário excluído." })
    }

    @HttpPut('/changepassword/')
    public async ChangePassword(req: Request, res: Response): Promise<ActionResult> {

        let user = new User(req.body)

        if (!user || !user.email || !user.password || !req.body.passwordNew) {
            return this.badRequest({ message: "Invalid request." })
        }

        const userRepo = (await this.connection).getRepository(User);
        const userQuery = await userRepo
            .createQueryBuilder("user")
            .where("id = :id OR email = :email", { id: user.id, email: user.email })
            .getOne()

        if (!userQuery) {
            return this.notFound({ message: "Usuário não encontrado." })
        }

        if (!compareSync(user.password, userQuery.passwordHash)) {
            return this.unauthorized({ message: "Senha incorreta." })
        }

        user.passwordHash = hashSync(req.body.passwordNew, 10);

        await userRepo
            .createQueryBuilder()
            .update(User)
            .set({ passwordHash: user.passwordHash })
            .where("id = :id", { id: userQuery.id })
            .execute();

        delete user.passwordHash;
        delete user.password;

        return this.ok({ message: "Senha atualizada." })
    }

}
