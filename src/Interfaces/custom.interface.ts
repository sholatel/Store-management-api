import { Request, Response } from 'express';

export interface  IRequest extends Request {
    user: {
        _id:string
    }
}


export interface ISendEmailOptions {
    recipient: string;
    subject: string;
    html: string;
}

export type IControllerFn = (req:IRequest, res:Response)=>any 