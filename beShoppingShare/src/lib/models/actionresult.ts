export type ContentType = 'json' | 'image';

export default class ActionResult {

    public statusCode: number;

    public contentType: ContentType;

    public result: any;

}