let jwt=require("jsonwebtoken");
let secrect=process.env.JWT_KEY

function createTokenForUser(user){
    let payLoad={
        _id : user._id,
        email : user.email,
    };

    let token=jwt.sign(payLoad,secrect);
    return token;
}

function validateToken(token){
    let payLoad=jwt.verify(token,secrect);
    return payLoad;
}

module.exports={
    createTokenForUser,
    validateToken,
}