//avatar and images are stored in third party which provides us url which we have to store in db and use
//cloudinary jaise file ko upload krleta hai turant appko uski information bhejta hai , like url , duration ,etc

//mongoose gives you liberty that you can inject methods as well in schema and use middlewares as well
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcrypt"; 

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            lowercase:true,
            //index true helps in optimizing searching 
            index:true
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            lowercase:true
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,//cloudinary url
            required:true
        },
        coverImage:{
            type:String
        },
        watchHistory:[
            {
            type:Schema.Types.ObjectId,
            ref:'Video'
        }
    ],
        password:{
            type:String,
            required:[true,"password is required"]
        },
        //we store refreshToken in db but does not store accessToken
        refreshToken:{
            type:String,
        }
    },
    {
        timestamps:true
    }
)

//these are hooks used like app.listen etc for events 

//v.v.v.important points - arrow fn does not have the reference of this (drawback)  , because you need the reference of above full schema of user 
userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next();
     
    this.password = bcrypt.hash(this.password,10); 
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
     return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    //ynha per jaise hi accesstoken generate hoga woh isse return krdega
    return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


//refresh token has less information becaues it got refresh everytime
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// below mongoose User can directly call directly db
export const User = mongoose.model("User", userSchema); 