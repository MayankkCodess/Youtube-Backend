import mongoose,{Schema} from 'mongoose'; 

// Think of this - mongoose aggregate paginate v2 
// also middlewares - like pre (means do somethings before saving data in db) , post - (means do after saving data in db)
// learn about plugins - (A plugin in Mongoose is a reusable piece of functionality that you can attach to a schema)

import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema(
    {
    videoFile:{
        type:String,//cloudinary url
        required:true
    },
    thumbnail:{
        type:String, //cloudinary url
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
       type:Number, //cloudinary (how - it provides you info)
       required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'val'
    }
},{
    timestamps:true
}
);

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema); 