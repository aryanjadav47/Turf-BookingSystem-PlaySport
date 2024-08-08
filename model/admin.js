let mongoose=require("mongoose");

let adminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
});

let admin=mongoose.model("admin",adminSchema);

module.exports=admin;