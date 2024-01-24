import {Request} from "express";


export type RequestWithBody<T> = Request<{},{},T>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithParams<T> = Request<T>
export type RequestWithPararmsAndBody<T,B> = Request<T,{},B>