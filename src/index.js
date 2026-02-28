// we want .env to load all variable to each files as early as possible so config dotenv in main file
 import dotenv from "dotenv";
 import connectDB from "./db/index.js"
 //this is an method which takes an object of path of env
 //you can also do it using package.json watch - chai code - lec -2 33:58 timeline
 dotenv.config({
      path:"./env"
 })

  

 connectDB();