// we want .env to load all variable to each files as early as possible, so configuring dotenv must be in main file
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
//this (.config) is an method which takes an object of path of env
//you can also do it in package.json watch - chai code - lec -2 33:58 timeline
dotenv.config({
  path: "./env",
});

// so when async db method completed it return promise so we handle below
connectDB()
  .then(() => {
    //before app.listen we have to listen for error also (app.on)
    app.on("error", (error) => {
      console.log("Error:", error);
      throw error;
    });
    //we use callback , because callback only run ya happen when app.listen(event) or say server(async) ka execution completes/happens
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is listening at port${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB connection failed`, err);
  });
