// here we have created method in controller but when it run or to use it  - for that we need a url from routes so do that 

// to start method of controller first need a url/ie. route actually 


// 1st Point - as we are transfering all properties of express into app 
// here we transfer all router() properties to router

// 2nd Point - you need to import this route in either main server file{index.js} / app.js 

import {Router} from "express"; 
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router(); 

// phir aap ynha aaye - tb router dekho mai aapko ek route deta hun , phir us pr _ http methods lga kr controller ke method ko run krdo
// this .fields take arrays - read documentation
router.route("/register").post(upload.fields([
    {
        name : "avatar",// this avatar must same in frontend react code
        maxCount: 1
    },
    {
        name : "coverImage",
        maxCount: 1
    }
]),registerUser)//upload give you many options as it is coming from multer

export default router;

