// Flow you want:

// User uploads file → goes to your server

// Multer stores file temporarily on local disk

// You send that file to Cloudinary

// If upload successful → delete file from server

// Save Cloudinary URL in DB

import multer from "multer"; 

// so if i think that the controller might be getting file from user i use this storage method
const storage = multer.diskStorage({
    //below 1. req(json data) is you getting from user , 2. file contain all files as json or etc data comings ways are configured in express already 
  destination: function (req, file, cb) {
    //below cb (callback) has many fields , null for not handling error and folder path to store files 
    cb(null, '../../public/temp')
  },
  filename: function (req, file, cb) {
    // below unique suffix is to change name of file for security and duplicate name purposes so you can add it later 
    // and also see in console that how much fields are in file.objects 

    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null,file.originalname); //so here i will get file name and localpath problem resolve
  }
})
// 1. when you write export then [not using blur of a variable disappear , even on declare directly ] 
// 2. in ES6 you dont needed to write [storage:storage] , if both are same then you can simple write - storage
export const upload = multer({
     storage: storage
     })