let mongoose=require("mongoose");
const { randomBytes, createHmac } = require("crypto");
let {createTokenForUser}=require("../servies/auth");

let userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:true,
    },
    number:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    cart : {
        type : Array,
        default : [],
    },
    orders:{
        type : Array,
        default : [],
    },
},{timestamps : true});

userSchema.pre("save", function(next){
    let user=this;

    if(!user.isModified("password")) return;

    let salt=randomBytes(16).toString();
    let hashedpassword=createHmac("sha256",salt).update(user.password).digest("hex");
    
    this.salt=salt;
    this.password=hashedpassword;


    next();
});


userSchema.static("matchUserPasswordAndToken", async function(email,password){
    let user=await this.findOne({email});
    if(!user) throw new Error("user not found");

    let salt=user.salt;
    let hashedpassword=user.password;

    let userProvidePassword=createHmac("sha256",salt).update(password).digest("hex");

    if(hashedpassword !== userProvidePassword) throw new Error("incorect password");

    let token=createTokenForUser(user);

    return token;
});

let user=mongoose.model("user", userSchema);

module.exports=user;