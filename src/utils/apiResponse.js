class apiResponse{
    constructor(statusCode,message ="Success", data , ){
        this.statusCode = statusCode
        this.data = data
        this.message = message;
        this.statusCode = statusCode <400
    }
}

export {apiResponse}; 