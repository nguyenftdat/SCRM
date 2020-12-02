//@flow
export type RequestModel = {
    Method:string,
    Token:string,
    Payload:any
}

export type ResponseModel = {
    Result:number,
    Description:string,
    Data:Array<any>
}