import 'reflect-metadata';
import dotenv from 'dotenv';
import { Server } from './server';
import { loadControllers } from './lib/dynamicloader';

dotenv.config({
    path: '.env'
});

export const server = new Server();

Promise.all([loadControllers(), server.createConnection()])
    .then(
        (values) => {

            values[0].forEach((c) => {
                server.router.use(c.route, c.instance);
            });

            server.setup((app) => {
                app.use('', server.router);
            });

            server.listen();
        },
        err => {
            console.error(err);
        }
    );