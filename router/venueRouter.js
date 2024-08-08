let express=require("express");
let router=express.Router();
let venue=require("../model/venues");
let user=require("../model/user");
let booking=require("../model/booking");
let multer=require("multer");
let islogedin=require("../middleware/isloggedin");

let storage=multer.diskStorage({
    destination:function(req,file,cb){
       return cb(null,"./public");
    },
    filename : function(req,file,cb){
       return cb(null,`${Date.now()}-${file.originalname}`);
    },
});
   
let upload=multer({storage});


router.post("/",upload.single("venueImage"),async (req,res)=>{
   try{
    let {cityName,venueName,location,priceByTime,timing,sportAva,facelity,aboutVenue,venueImage}=req.body;
    await venue.create({
        cityName,
        venueName,
        location,
        timing,
        priceByTime,
        sportAva,
        facelity,
        aboutVenue,
        venueImage : req.file.filename,
    });
    return res.redirect("/dashboard");
}catch(err){
    res.status(400).send(err);
}
});

router.post("/update/:id",async (req,res)=>{
    try {
        let id=req.params.id;
        let {cityName,venueName,location,priceByTime,timing,sportAva,facelity,aboutVenue}=req.body;
        await venue.findByIdAndUpdate(id,{
        cityName,
        venueName,
        location,
        timing,
        priceByTime,
        sportAva,
        facelity,
        aboutVenue,
        });
        return res.redirect("/dashboard");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/venue/update/:id",async (req,res)=>{
    try {
        let id=req.params.id;
        let result=await venue.findById(id);
        if(!result){
            req.flash("error","not found id");
            return res.redirect("/dashboard");
        }
        else{
            return res.render("updateVenue",{venue : result});
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/venue/delete/:id",async (req,res)=>{
    try {
        let id=req.params.id;
        await venue.findByIdAndDelete(id);
        return res.redirect("/dashboard");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/show/:id",async (req,res)=>{
    try{
        let id=req.params.id;
        let result=await venue.findById(id);
        return res.render("showDetails",{ venue : result, user:req.user, booking : req.booking });
    } catch(err){
        res.send(err);
    }
});

router.get("/cart/:id",islogedin,async (req,res)=>{
    try{
        let {email}=req.body;
        let id=req.params.id;
        let result=await venue.findById(id);
        let show=await user.findOneAndUpdate(email);
        return res.render("cart",{ venue : result, user:show,user:req.user, booking : req.booking});
    } catch(err){
        res.send(err);
    }
});

router.post("/ven",async (req,res)=>{
    try{
        let {cityname,turfName,userEmail,userNumber,bookingDate,startTime,endTime,totalCost}=req.body
        await booking.create({
            cityname,
            turfName,
            userEmail,
            userNumber,
            bookingDate,
            startTime,
            endTime,
            totalCost
        });
        return res.redirect("/conform/");
    } catch(err) {
        res.send(err);
    }
});

router.get("/conform",async(req,res)=>{
    try {
        let {userNumber}=req.body;
        let {email}=req.body;
        let show=await user.findOneAndUpdate(email);
        let bookings=await booking.findOneAndUpdate(userNumber);
        return res.render("orderconform",{  user:show, booking:bookings, user:req.user})
    } catch (error) {
        res.send(error);
    }
});

router.get('/showbooking',async (req,res)=>{
    try {
        let {userEmail}=req.query;
        let query = {};
    
        if (userEmail) {
          query.userEmail = userEmail;
        }
        const bookings = await booking.find(query);
        res.render('showbooking', { bookings, userEmail });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/booking/delete/:id",async(req,res)=>{
    try {
        let id=req.params.id;
        await booking.findByIdAndDelete(id);
        return res.redirect("/showbooking");
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/booking/update/:id",async(req,res)=>{
    try {
        let id=req.params.id;
        let result =await booking.findById(id);
        return res.render("updatebooking", {booking:result});
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/booke/update/:id",async(req,res)=>{
    try {
        let id=req.params.id;
        let {cityname,turfName,userEmail,userNumber,bookingDate,startTime,endTime,totalCost}=req.body
        await booking.findByIdAndUpdate(id,{
            cityname,
            turfName,
            userEmail,
            userNumber,
            bookingDate,
            startTime,
            endTime,
            totalCost
        });
        return res.redirect("/showbooking");
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports=router;