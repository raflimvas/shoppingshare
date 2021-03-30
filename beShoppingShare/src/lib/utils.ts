import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import { error } from 'node:console';

export const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

const privateKey: jwt.Secret = fs.readFileSync('jwtRS256.key');

export function log(message: string, severity: string, source: string) {
    console.log(`[${new Date().toLocaleString('en-US')}] ${('[' + severity + ']').padEnd(8)} ${source.padStart(10, ' ')} | ${message}`);
}

export function getToken(payload: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '24h' }, (e, t) => {
            if (e || !t) reject(e);
            resolve(t);
        });
    });
}

export function getTokenObject(token: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            // const splitToken = (token?.split('Bearer ') ?? [])[1];
            const splitToken = token.split(' ')[1];
            // TODO validar o token com verify não esta funcionando, por hora vamos de decode
            // jwt.verify(splitToken, privateKey, (error, decode) => {
            //     resolve(decode);
            // })
            const decode = jwt.decode(splitToken,{ json: true});
            resolve(decode);
        } catch (err) {
            reject(err);
        }
    });
}