//Errors can be trace using Node , so we use node documentation 
//but for api request,response we have to use express 

class ApiError extends Error {
    constructor(
        statusCode,
        message = "Somethings went Wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        //read about this why data null
        this.data = null 
        this.message = message
        this.success = false
        this.errors = errors
        

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}