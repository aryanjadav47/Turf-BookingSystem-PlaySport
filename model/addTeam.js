let mongoose=require("mongoose");

let teamSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
},{timestamps : true});

let team=mongoose.model("team",teamSchema);

module.exports=team;