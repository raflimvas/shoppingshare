import { StatusCodes } from "../decorators";

export type ContentType = 'json' | 'image';

export default class ActionResult {

    public statusCode: StatusCodes;

    public contentType: ContentType;

    public result: any;

}