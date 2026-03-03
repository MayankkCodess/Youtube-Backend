import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//()()- this is an IIFE in js used as - ;()()
//node.js gives us access to proccess -(this current application is running on process , and below is that refrence)

 // below async method when completed it always return promise
 const connectDB = async ()=>{
    try {
        //mongoose actually gives you a return object below , so we get response in connectionInstance below
       const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
       //for getting mongodb url where connection is happening , because database is always different for production , development ,testing
       console.log(`\n MongoDB Connected !! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        //this type of writing helps in debugging... 
        console.log("MongoDB Connection Error/Failed:",error); 
        //read about these process exits - 0,1,etc - [exit code 1 = failure , exit code 0 = success]
        process.exit(1);
    }
}

export default connectDB;