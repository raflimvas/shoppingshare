import * as path from 'path';
import glob from 'glob';
import express, { NextFunction, Request, Response, Router } from 'express';
import ActionResult from './models/actionresult';

export async function loadControllers(): Promise<{ route: string, instance: Router }[]> {

    const bp = express.json();

    return new Promise<{ route: string, instance: Router }[]>((resolve, reject) => {
        try {
            glob(path.resolve(__dirname, '../controllers/**/*.controller.ts'),
                async (er, m) => {
                    if (!er) {
                        const result = [];

                        for (let file of m) {
                            const instance = await import(file).catch(error => { throw error; });
                            const prototype = (Object.values(instance)[0] as any).prototype;
                            const router = Router();

                            let groups = {} as any;

                            for (let item of Object.getOwnPropertyNames(prototype)) {
                                if (prototype[item].route) {
                                    groups[prototype[item].route] = groups[prototype[item].route] || [];
                                    groups[prototype[item].route].push(item);
                                }
                            }

                            for (let route in groups) {

                                const tempRoute = router.route(route);

                                for (let func of groups[route]) {

                                    const action = async (req: Request, res: Response, next: NextFunction) => {
                                        const ar: ActionResult = await prototype[func](req);
                                        if (ar.result && ar.contentType === 'json') 
                                            res.status(ar.statusCode).json(ar.result);
                                        else if (ar.result && ar.contentType === 'image') 
                                            res.status(ar.statusCode).set('Content-Type', 'image/png').send(ar.result);
                                        else res.sendStatus(ar.statusCode);
                                    };

                                    switch (prototype[func].method) {
                                        case 'get':
                                            tempRoute.get(action);
                                            break;
                                        case 'post':
                                            tempRoute.post(action);
                                            break;
                                        case 'put':
                                            tempRoute.put(action);
                                            break;
                                        case 'delete':
                                            tempRoute.delete(action);
                                            break;
                                        default:
                                            tempRoute.get(action);
                                            break;
                                    }
                                }

                            }

                            result.push({
                                route: prototype.route,
                                instance: router
                            });
                        }

                        resolve(result);
                    } else {
                        reject(er);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
}