let mongoose=require("mongoose");

let contactSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique : true,
    },
    message:{
        type:String,
        required: true,
    },
    createdAt: {type: Date, default: Date.now},
},{timestamps : true});


let contact=mongoose.model("contact",contactSchema);

module.exports=contact;