const jsonResponse = ( message:string, code?: string | number ,data:any = null)=> {
    return {
        message,
        code,
        data
    }
}

export default jsonResponse;
