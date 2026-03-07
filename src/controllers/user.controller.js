// Logic Building Exercise - write as much controller you can 
// always do console.log() to know more -------- response-cloudinary , req.body , req.files , 
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
// this exercise some do using 1. real world projects , 2. some do by leetcode / dsa questions 

// here we have created method in controller but when it run or to use it  - for that we need a url from routes so do that 

export const registerUser = asyncHandler(  async (req,res) =>{
    // *********Logic Building******* - Problem - You have to register User
    // Write steps always to split big problem into small problems 

    //1. User data send krega check krunga acc. schema ki sab hai 
    //2. User ki email check krunga db se ke knhi already registered toh nahi 
    //3. before creating user in db - hash the password 
    //4. now create krunga user in db 
    //5. send krdunga response with all details to frontend 

     // ***************Chai aur Code*************
    //get user details from frontend/postman {check models in backend }
    //validation -  not empty , etc
    //check if user already exists : username , email 
    // check for images , check for avatar  
    // upload them to cloudinary , check avatar
    // create user object(as mongodb is no sql) - creation call/entry in db
    //***** .create() returns the full mongoose document instance.
    // remove password and refresh token field from response 
    // check for user creation 
    // return res
    

    //*** req.body mai keval form aur json se aane wala data milta hai , but if data is coming for ** URL** then later????? 
    // params is also a way to send data from frontend to backend 

    // so hum kya karte hain req.body mai jo data aa rha hai usse destructure krlete hain 
         const {fullName,username,password,email} = req.body; 
    if( //.some return true /false and demands a callback fn
        [fullName,email,username,password].some((field)=> 
        field?.trim() === "")
    ){
        throw new ApiError(400 , "All Fields are required"); 
    }

   const existedUser = await User.findOne({
    $or:[{username},{email}]
   })
   if(existedUser){
    throw new ApiError(409 , "User already registered");
   }
// optional chaining (?.) is used to safely access properties of objects that might be null or undefined without crashing the program.
//    middleware - what it do is - it adds more fields in req.body
// multer give you - req.files?.avatar[0]

const avatarLocalPath = req.files?.avatar?.[0]?.path;
const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required");
}
//await = pause here until result arrives,But JavaScript engine keeps running other tasks meanwhile.
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400,"Avatar file is required");
}
//.create() - method takes - object
const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
})
// now from created user you can delete password directly above , or by another way 
const createdUser = await User.findById(user._id).select(//.select used for removing properties
    "-password -refreshToken"
)
if(!createdUser){
    throw new ApiError(500,"something went wrong while registering user")
}
return res.status(201).json(
    new apiResponse(200,createdUser,`${user.fullName} Registered Successfully.`)
)
})


export const loginUser = asyncHandler()