let mongoose=require("mongoose");

let venueSchema=new mongoose.Schema({
    cityName:{
        type:String,
        required:true,
    },
    venueName:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    timing:{
        type:String,
        required:true,
    },
    sportAva:{
        type:String,
        required:true,
    },
    facelity:{
        type:String,
        required:true,
    },
    aboutVenue:{
        type:String,
        required:true,
    },
    priceByTime:{
        type:String,
        required:true,
    },
    venueImage:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
},{timestamps:true});

let venue=mongoose.model("venue",venueSchema);

module.exports=venue;