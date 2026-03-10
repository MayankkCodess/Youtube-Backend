// const asyncHandler = () =>{()=>{}} //higher order function and here we can remove its external curly braces also
//you can write above also like this - () => () =>{};

//first way - try catch

// const asyncHandler = (fn) => {
//   return async (req, res, next) => {
//     try {
//        await fn(req, res, next);
//     } catch (error) {
//       res.status(error.code || 500).json({
//         //here success is flag like (next);
//         success: false,
//         message: error.message,
//       });
//     }
//   };
// };


//second way - promises


const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    //below this .catch(next(err)) passes error to middleware (errorhandling middleware) which then sends response to frontend 
    // if no error.middleware , then express default error handling works 
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};


export { asyncHandler };
