import { StatusCodes } from '../decorators';

export default class ErrorHandler extends Error {
    constructor(
        public statusCode: StatusCodes,
        public message: string
    ) {
        super();
    }
}