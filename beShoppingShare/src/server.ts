import express, { Router, Express, Request, Response, NextFunction } from 'express';
import { Connection, ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { getTokenObject, log } from './lib/utils';
import ErrorHandler from './lib/models/errorhandler';
import { anonymousRoutes, swaggerJson } from './lib/dynamicloader';
import helmet from 'helmet';

export class Server {

    public app: Express;
    public router: Router;
    
    private connectionOptions: ConnectionOptions;
    private connection: Connection;

    constructor() {
        this.router = Router();
        this.app = express();
    }

    public setup(func?: (app: Express) => void): void {
        this.app.use(cors());

        this.app.use(helmet())
        this.app.get('/favicon.ico', (req, res) => res.sendStatus(204));
        
        this.app.use('/swagger', swaggerUi.serve);
        this.app.get('/swagger', swaggerUi.setup(swaggerJson));

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        if (process.env.DEBUG) this.app.use(this.debugHandler);
        this.app.use(this.authHandler);
        this.app.use(this.errorHandler);
        
        if (func) func(this.app);
    }

    public listen(): void {
        let port = process.env.APP_PORT || 5000;

        if (process.env.NODE_ENV == 'production') {
            port = process.env.PORT || 80;
        }

        this.app.listen(port, () => log(`Listening on port ${port}`, 'INFO', 'Server'));
    }

    private debugHandler(req: Request, res: Response, next: NextFunction) {
        log(JSON.stringify({
            path: req.path, method: req.method, body: req.body, header: req.headers
        }), 'DEBUG', 'Request');
        next();
    }

    private async authHandler(req: Request, res: Response, next: NextFunction) {
        if (anonymousRoutes.some(x => x.method == req.method.toLowerCase() && x.route == req.path)) {
            next();
        } else {
            if (!req.headers.authorization) {
                res.status(401).json({
                    status: 'error',
                    statusCode: 401,
                    message: 'Voc?? n??o pode acessar esse endpoint sem um token v??lido!'
                });  
            }
            try {
                const userToken = await getTokenObject(req.headers.authorization);
                // TODO: Validar o token

                if (!userToken){
                    res.status(401).json({
                        status: 'error',
                        statusCode: 401,
                        message: 'Voc?? n??o pode acessar esse endpoint sem um token v??lido!'
                    });  
                } else {
                    next();
                }
            }
            catch(err) {
                res.status(401).json({
                    status: 'error',
                    statusCode: 401,
                    message: 'Voc?? n??o pode acessar esse endpoint sem um token v??lido!'
                });  
            }
        }
    }

    private errorHandler(err: ErrorHandler, req: Request, res: Response, next: NextFunction) {
        res.status(err.statusCode || 500).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message
        });
    }

    public async createConnection(): Promise<void> {
        this.connectionOptions = await getConnectionOptions();
        this.connection = await createConnection(this.connectionOptions);
    }

    public async getConnection(): Promise<Connection> {
        if (this.connection) {
            return this.connection;
        } else {
            this.connection = await createConnection(this.connectionOptions);
            return this.connection;
        }
    }

}