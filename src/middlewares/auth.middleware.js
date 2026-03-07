import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

//below _ means if somewhere any res,req,next got unused then you write that there 
export const isAuthenticated = asyncHandler(async(req,_,next) =>{
   try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")
 
    if(!token){
     throw new ApiError(401,"UnAuthorized request")
    }
    // see carefully in user model what fields you are attaching with accesstoken
    const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
    const user = await User.findById(decodeToken._id).select(
     "-password -refreshToken"
    )
 
    if(!user){
     // *** important learn about it from frontend knowledge
     throw new ApiError(401,"invalid access token "); 
    }
    // setting .user of req as user which you get above from db 
    req.user = user; 
    next();
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
   }
})

/*

Mayank, since you are building MERN projects and backend systems, understanding middleware deeply is very important because almost every production Express app relies on middleware pipelines.

I’ll explain this in a core backend-engineer way, not just definition.

1. What Middleware Actually Is

In Express.js, middleware is simply a function that runs between the request and the response.

Flow of a request:

Client Request
      ↓
Middleware 1
      ↓
Middleware 2
      ↓
Middleware 3
      ↓
Route Handler (Controller)
      ↓
Response sent to client

A middleware can:

read request

modify request

run some logic

stop request

send response

pass control to next middleware

2. Basic Structure of Middleware
function middleware(req, res, next){
   // logic here

   next()
}

Parameters:

req   → request object
res   → response object
next  → function that passes control
3. What next() Actually Does

next() means:

"Move the request to the next middleware in the stack."

Example:

app.use((req,res,next)=>{
   console.log("Middleware 1");
   next();
})

app.use((req,res,next)=>{
   console.log("Middleware 2");
   next();
})

app.get("/",(req,res)=>{
   res.send("Hello");
})

Execution order:

Middleware 1
Middleware 2
Route Handler
4. What Happens If You DON'T Call next()

If middleware does not call next() and does not send response, the request hangs forever.

Example:

app.use((req,res,next)=>{
   console.log("Hello");
})

Result:

Request never reaches route
Browser keeps loading

Because the pipeline stops there.

5. Middleware Can Also End the Request

Sometimes middleware does not call next() because it already sends response.

Example: Authentication middleware

function auth(req,res,next){

   if(!req.user){
       return res.status(401).json({
          message:"Unauthorized"
       })
   }

   next()
}

Flow:

Unauthorized user
      ↓
Middleware sends response
      ↓
Request ends
6. Middleware Execution Stack (Very Important Concept)

Express maintains a stack (array) of middleware.

Example internally:

[
 loggerMiddleware,
 bodyParserMiddleware,
 authMiddleware,
 routeHandler
]

When request arrives:

index = 0

run stack[index]
index++
run stack[index]
...

Calling next() basically means:

run stack[index+1]
7. Types of Middleware (Important for Interviews)
1️⃣ Application Middleware

Applied to whole app

app.use(middleware)

Example

app.use(express.json())
2️⃣ Router Middleware

Applied to specific routes

app.get("/profile", authMiddleware, controller)

Execution:

authMiddleware → controller
3️⃣ Error Handling Middleware

Special middleware with 4 parameters

(err, req, res, next)

Example:

app.use((err,req,res,next)=>{
   res.status(500).json({
      message:err.message
   })
})

Express identifies error middleware by 4 parameters.

4️⃣ Built-in Middleware

Express provides some built-in middleware:

Examples:

express.json()
express.urlencoded()
express.static()
5️⃣ Third Party Middleware

Libraries used as middleware.

Examples:

Multer → file upload

Morgan → logging

CORS → allow cross origin

8. Middleware Can Modify Request

Very common backend pattern.

Example:

function auth(req,res,next){

   const token = req.headers.authorization

   const user = verifyToken(token)

   req.user = user

   next()
}

Then controller can access:

req.user

Flow:

Request
   ↓
Auth Middleware adds user
   ↓
Controller uses req.user
9. Multiple Middleware Example
app.get(
   "/dashboard",
   authMiddleware,
   roleMiddleware,
   dashboardController
)

Execution:

Request
   ↓
authMiddleware
   ↓
roleMiddleware
   ↓
dashboardController
10. Middleware Can Call next(err)

If middleware finds error:

next(err)

Example:

function middleware(req,res,next){

   try{
       something()
       next()
   }
   catch(err){
       next(err)
   }
}

Then Express jumps to error middleware.

app.use((err,req,res,next)=>{
   res.status(500).send(err.message)
})
11. Real Production Middleware Flow

Example MERN backend:

Request
   ↓
CORS middleware
   ↓
JSON parser
   ↓
Logger
   ↓
Auth middleware
   ↓
Route handler
   ↓
Error middleware
12. Professional Backend Rule

Every middleware must either:

1️⃣ send response
OR
2️⃣ call next()

Otherwise request gets stuck.

13. Real Example (Production Style)
const auth = (req,res,next)=>{
   const token = req.headers.authorization

   if(!token){
      return res.status(401).json({
         message:"No token"
      })
   }

   try{
      const user = verify(token)
      req.user = user
      next()
   }
   catch(err){
      next(err)
   }
}
14. Why Middleware is Powerful

Middleware allows separation of concerns.

Instead of this inside controller:

checkAuth()
validateInput()
logRequest()
handleController()

We separate them:

authMiddleware
validationMiddleware
loggingMiddleware
controller

This makes backend scalable and clean.

15. One Deep Concept (Important for Senior Backend)

Express middleware works on something called:

REQUEST LIFECYCLE PIPELINE

Meaning:

Every request travels through a chain of functions

That chain is middleware.

Now I Want to Test Your Backend Thinking 🧠

Answer these without Googling.

Question 1
app.use((req,res,next)=>{
   console.log("A")
   next()
})

app.use((req,res,next)=>{
   console.log("B")
})

app.get("/",(req,res)=>{
   res.send("Hello")
})

What will happen when request hits / ?

Question 2

Why is this wrong?

app.use((req,res,next)=>{
   res.send("Hello")
   next()
})
Question 3

Which middleware runs first?

app.use(express.json())
app.use(authMiddleware)
app.use(logger)

*/