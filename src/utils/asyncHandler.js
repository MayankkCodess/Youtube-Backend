// const asyncHandler = () =>{()=>{}} //higher order function and here we can remove its external curly braces also
//you can write above also like this - () => () =>{};

//first way - try catch

const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
       await fn(req, res, next);
    } catch (error) {
      res.status(error.code || 500).json({
        //here success is flag like (next);
        success: false,
        message: error.message,
      });
    }
  };
};

//second way - promises


// const asyncHandler = (requestHandler) => {
//   (req, res, next) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//   };
// };


export { asyncHandler };
