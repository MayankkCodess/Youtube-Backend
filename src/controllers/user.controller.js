// Logic Building Exercise - write as much controller you can 
// always do console.log() to know more -------- response-cloudinary , req.body , req.files , 
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
// this exercise some do using 1. real world projects , 2. some do by leetcode / dsa questions 

// here we have created method in controller but when it run or to use it  - for that we need a url from routes so do that 

//we are going to create seperate method for generating access & refresh token 
const generateAccessAndRefreshToken = async(userId) =>{
     try {
        const user = await  User.findById(userId); 
       const accessToken =  user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //now , we provide accesstoken to user but we store refreshToken in db as well 
        // to add value in object 
        user.refreshToken = refreshToken;
        // validation before save is because of , as we are not passing all fields of user to save in db , which is contradict to db 
        await user.save({validationBeforeSave:false})

        return {accessToken,refreshToken}
     } catch (error) {
        throw new ApiError(500, "something went wrong while generating token"); 
     }
}


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
return res.status(200).json(
    new apiResponse(200,createdUser,`${user.fullName} Registered Successfully.`)
)
})


export const loginUser = asyncHandler(async(req,res)=>{
    // logic building --- 
    // 1. i will check , is all fields are coming 
    // 2. then i will check , iss mail ka user db mai hai 
    // 3. i will check password details from user comparing using bcrypt 
    
    // chai aur code ---------
    /* req body <- data 
        username or email check 
        find the user 
        password check 
        acces and refresh token 
        send cookie 
        */

         const {email , username , password}= req.body;
         // check logic of this below - 
         if(!(email || username) || !password) {
            return res.status(400).json({
                message : "Some fields are missing.",
                success:false
            })
         }
         // *** vvv imp-- this user instance you get from db have the schema methods like access,refesh , bcryptetc in user model .. remember - User does not have anything
         //*Debugging below :- find() always returns an array , so use findOne() because below you are using - user.isPasswordCorrect(password) and it will crash because only object contains schema methods.
         const user = await User.findOne({
            $or:[{username},{email}]
         })
        
         if(!user) {
            return res.status(400).json({
                message:"User not found. Plese register yourself.",
                success:false
            })
         }

         // *** vvv imp-- this user instance you get from db have the schema methods like access,refesh , bcryptetc in user model .. remember - User does not have anything
         const isPasswordValidate = await user.isPasswordCorrect(password);
         if(!isPasswordValidate){
            throw new ApiError(404, "Invalid Password . Please try again"); 
         }

         // now below , if you see clearly - it may possible for method to take time so use await
         // and also from the method you get two properties in return so destructure them also 
         const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);  
         
         // now if you see the {user} you have is old because now user has refresh token also in its documents so either update or make one extra db call 
         const loggedInOrUpdatedUser = await User.findById(user._id).select(
            "-password -refreshToken"
         )
         
         // so when you have to send cookies , then you have to basically create a object 
         const options = {
            httpOnly:true,
            secure:false,//when you do httpOnly & secure as true , that means now only backend can modify cookies , by default frontend can also modify it , so here you are securing from frontend
         }
         //key name & then value
         return res.status(200).cookie("accessToken",accessToken,options)
         .cookie("refreshToken",refreshToken,options)
         .json({
            message:`${user.fullName} Logged In Successfully.`,
            success:true,
            refreshToken,accessToken,loggedInOrUpdatedUser
         })
 
         //*vvv.imp - if you see , req is a object in which by using middleware like multer cookieparser you have added req.files and req,res.cookie just by using cookieparser middlewareetc 
         // so that means you can also creat your own middleware to add something in objects  

})

export const logoutUser = asyncHandler(async(req,res)=>{
            // req.user you get from middleware method isAuthenticated , which has changed or add .user in req object 
            
            //remember - removing from DB and removing from user are two different things 
            await User.findByIdAndUpdate(
                req.user._id,
                {
                    $set:{
                            refreshToken:undefined
                    }
                },
                {
                    // below we are demading a new update data from db in return document
                    new:true
                }
            )
            // below we are going to delete cookies from user also 
            const options = {
                httpOnly:true,
                secure:false// remember :- secure : true krne ka matlab , keval https pr hi browser mein cookies send kr paoge
            }
            return res.status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(new apiResponse(200 , {} , "User LoggedOut Successfully."))
         })

