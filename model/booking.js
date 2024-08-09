
let mongoose=require("mongoose");

let bookingSchema=new mongoose.Schema({
    cityname:{
        type:String,
    },
    turfName:{
        type:String,
    },
    userEmail:{
        type:String,
    },
    userNumber:{
        type:String,
    },
    bookingDate:{
        type:String,
        required:true,
    },
    startTime:{
        type:String,
        required:true,
    },
    endTime:{
        type:String,
        required:true,
    },
    totalCost:{
        type:String,
    },
}, {timestamps : true});


let booking=mongoose.model("booking", bookingSchema);

module.exports=booking;