let express=require("express");
let router=express.Router();
let user=require("../model/user");
let contact=require("../model/contact");
let islogedin=require("../middleware/isloggedin");
let admin=require("../model/admin");
let team=require("../model/addTeam");
let venue=require("../model/venues");
let booking=require("../model/booking");
let multer=require("multer");


let storage=multer.diskStorage({
 destination:function(req,file,cb){
    return cb(null,"./uploads");
 },
 filename : function(req,file,cb){
    return cb(null,`${Date.now()}-${file.originalname}`);
 },
});

let upload=multer({storage});


router.get("/", async (req,res)=>{
    try{
    const { cityName, sportAva, venueName } = req.query;
    
        // Build the query object
        let query = {};
    
        if (cityName) {
          query.cityName = cityName;
        }
    
        if (sportAva) {
          query.sportAva = cricket;
        }
    
        if (venueName) {
          query.venueName = venueName;
        }
    
        const venues = await venue.find(query);
    return res.render("home",{
        user : req.user,venues,cityName,sportAva,venueName
    });
}catch(err){
    res.send(err);
}
});

router.get("/create",(req,res)=>{
    try{
    let error=req.flash("error");
    return res.render("create", {error});
    }catch(err){
        res.send(err);
    }
});


router.get("/login",(req,res)=>{
    try{
    let error=req.flash("error");
    return res.render("login", {error});
    }
    catch(err){
        res.send(err);
    }
});

router.post("/add",async(req,res)=>{
    
    try {
        let {name,email,password,number}=req.body;

        let users= await  user.findOne({email : email});
        if(users) {
             req.flash("error","you already have an account, please login.");
             return res.redirect("/create");
        }
        else{

                await user.create({
                        name,
                        email,
                        password,
                        number,
                    });

                    
                    res.redirect("/");    
                }    

    } catch(err){
        res.send(err.message);
    }

});

router.post("/login", async(req,res)=>{
    try{
    let {email,password}=req.body;
    let token=await user.matchUserPasswordAndToken(email,password);
    if(!token) {
        req.flash("error","user not found");
    }
    else{
    return res.cookie("token", token).redirect('/');
    }
} catch(err){
    res.send(err.message);
}
});

router.get("/logout", (req,res)=>{
    res.clearCookie("token").redirect("/");
});

router.post("/contact", async (req,res)=>{
    try{
    let {name,email,message}=req.body;
    await contact.create({
        name,
        email,
        message,
    });

    return res.redirect("/");
}catch(err){
    res.send(err);
}
});

// router.post("/adm",async (req,res)=>{
//     try {
//         let {email,password}=req.body;
//         await admin.create({email,password});
//         return res.render("ad-login");
//     } catch (err) {
//         res.send(err.message);
//     }
// });

router.post("/", async (req,res)=>{
     try{
        const { cityName } = req.query;
    
        // Build the query object
        let query = {};
    
        if (cityName) {
          query.cityName = cityName;
        }
        const temas = await team.find().exec();
        const bookings = await booking.find().exec();
        const venues = await venue.find(query);
        let {email, password}=req.body;
        let admins=await admin.findOne({email : email, password : password});
        if(!admins){
            
            req.flash("error","your are not admin please login!");
            return res.redirect("/admin");
        }
        else{
            return res.render("dashboard",{venues, cityName,  team: temas,booking:bookings});
        }
    } catch(err){
        res.send(err.message);
    } 
});

router.get("/admin",async (req,res)=>{
    // let error=req.flash("error"); 
    // return res.render("ad-login", {error});
    try {
        let error=req.flash("error");
        const temas = await team.find().exec();
        const venues = await venue.find().exec();
        res.render('ad-login', { venue: venues, team: temas, error });
    } catch (err) {
        res.status(500).send(err);
    }
});


router.get("/addVenues",(req,res)=>{
    return res.render("addvenues");
});

router.get("/dashboard",async (req,res)=>{
    try {
        const { cityName } = req.query;
    
        // Build the query object
        let query = {};
    
        if (cityName) {
          query.cityName = cityName;
        }
        const bookings = await booking.find().exec();
        const temas = await team.find().exec();
        const venues = await venue.find(query);
        return res.render('dashboard', { venues, cityName, team: temas, booking:bookings });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/message", async (req,res)=>{
    try {
        const contacts = await contact.find().exec();
        res.render('message', { contact: contacts });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/meg/delete/:id",async (req,res)=>{
    try {
        let id=req.params.id
        let result=await contact.findByIdAndDelete(id);
        return res.redirect("/message");
        
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/team",async(req,res)=>{
    try {
        const teams = await team.find().exec();
        res.render('team', { team: teams });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/addMember",(req,res)=>{
    return res.render("addMember");
});

router.post("/member",upload.single("image"), async (req,res)=>{
    
    try {
        let { name,email,role,status,image}=req.body;
        await team.create({
            name,
            email,
            role,
            status,
            image : req.file.filename,
        });
        return res.redirect("/team");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/update/:id",async (req,res)=>{
    try{
    let id=req.params.id;
    let result=await team.findById(id);
    if(!result){
        req.flash("error","something went wroung!");
        return res.redirect("/team");
    }
    else{
        return res.render("updateTeam",{ team: result});
    }
 } catch(err){
    res.status(500).send(err);
 }

});

router.post("/:id", async(req,res)=>{
    try {
        let id=req.params.id;
    let {name,email,role,status}=req.body;
    await team.findByIdAndUpdate(id,{
        name,
        email,
        role,
        status,
    });
    return res.redirect("/team");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/delete/:id",async (req,res)=>{
    try {
        let id=req.params.id;
        await team.findByIdAndDelete(id);
        return res.redirect("/team");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/find", async (req,res)=>{
    try {
        let error=req.flash("error");
        const { cityName, sportAva } = req.query;
    
        // Build the query object
        let query = {};
    
        if (cityName) {
          query.cityName = cityName;
        }
    
        if (sportAva) {
          query.sportAva = sportAva;
        }
    
        const venues = await venue.find(query);
    
        // Pass query parameters and products to the EJS template
        res.render('find', { venues, cityName, sportAva, user : req.user,error });
      } catch (err) {
        res.status(500).send(err);
      }
});




module.exports=router;