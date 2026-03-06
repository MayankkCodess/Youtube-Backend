// what we are doing is - server pe toh file ja chuki hai ab app mujhe local path doge toh mai file ko cloudinary pe dal dunga 
// aur jb successfully file upload ho jaye toh hum usse apne server se remove krdenge


//fs is a file system in node which helps you read ,write, files , all work related to file 
// read file system documentation of node.js

//fsPromises.unlink(path) // 

import {v2 as cloudinary} from "cloudinary"; 
import fs from "fs"; 

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET , 
})


//EK METHOD BANA LETE HAIN US METHOD KE APP PARAMETER M MUJHE USKA PATH DOGE MAI USKO UPLOAD KRDUNGA AGAR SUCCESSFULLY UPLOAD HO GAYA TOH FILE KO UNLINK KRDUNGA

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary , it will take some time so use await below it will give some object so return that to client
         const response = await cloudinary.uploader.upload(
            localFilePath , 
            {
                resource_type:"auto"
            }
        )
        // file has been uploaded successfully 
        console.log("file is uploaded on cloudinary",
            response.url ); 
            //as file uploaded successfully remove that from server 
              fs.unlinkSync(localFilePath);
            // below we are returning full response object to controller with use it 
        return response; 
    } catch (error) {
        // now think - if there is error in uploading on cloudinary ,then remember i already have localpath that means file is already on my server - so that means i have to remove that from my server 
        fs.unlinkSync(localFilePath)// remove the locally saved temporary file 
        // as the uploader operation got failed and (Sync) means - dont go forward without executing this line


    }
}

export {uploadOnCloudinary}; 