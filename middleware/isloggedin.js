let jwt=require("jsonwebtoken");
let user=require("../model/user");

module.exports=async function (req,res,next){
    if(!req.cookies.token){
        req.flash("error", "you need to login first, and if you can't create your account first create account and login.");
        return res.redirect("/login");
    }

    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let users= await user.findOne({ email : decoded.email }).select("-password");
        req.user=users;
        next();
    } catch(err){
        req.flash("error", "something went wroung.");
        res.redirect("/");
    }
};