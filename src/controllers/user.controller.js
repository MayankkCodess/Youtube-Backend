// Logic Building Exercise - write as much controller you can 

import { asyncHandler } from "../utils/asyncHandler.js";

// this exercise some do using 1. real world projects , 2. some do by leetcode / dsa questions 

// here we have created method in controller but when it run or to use it  - for that we need a url from routes so do that 

export const registerUser = asyncHandler( async (req,res) =>{
    return res.status(200).json({
        message:"User Registered Successfully",
        success:true
    })
})