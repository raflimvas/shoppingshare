import { Request } from 'express';
import { Connection } from 'typeorm';
import { server } from '../../app';
import ActionResult, { ContentType } from '../../lib/models/actionresult';
import ErrorHandler from '../../lib/models/errorhandler';
import { StatusCodes } from '../decorators';
import { getTokenObject } from '../utils';

export class ControllerBase {

    protected get connection(): Promise<Connection> {
        return new Promise<Connection>(async (resolve, reject) => {
            try {
                const conn = await server.getConnection();
                resolve(conn);
            }
            catch (err) {
                reject(err);
            }
        });
    }

    protected ok(result?: any, contentType?: ContentType): ActionResult {
        return {
            statusCode: StatusCodes.OK,
            contentType: contentType ?? 'json',
            result: result
        }
    }

    protected badRequest(result?: any, contentType?: ContentType): ActionResult {
        return {
            statusCode: StatusCodes.BadRequest,
            contentType: contentType ?? 'json',
            result: result
        }
    }

    protected unauthorized(result?: any, contentType?: ContentType): ActionResult {
        return {
            statusCode: StatusCodes.Unauthorized,
            contentType: contentType ?? 'json',
            result: result
        }
    }

    protected notFound(result?: any, contentType?: ContentType): ActionResult {
        return {
            statusCode: StatusCodes.NotFound,
            contentType: contentType ?? 'json',
            result: result
        }
    }

    protected statusCode(status: StatusCodes, result?: any, contentType?: ContentType) {
        return {
            statusCode: status,
            contentType: contentType ?? 'json',
            result: result
        }
    }

    protected throwError(message: string, statusCode?: number): ActionResult {
        throw new ErrorHandler(statusCode ?? 500, message);
    }

    protected async userContext(req: Request): Promise<any> {        
        const token = await getTokenObject(req.headers.authorization)
        return token.data;
    }

}