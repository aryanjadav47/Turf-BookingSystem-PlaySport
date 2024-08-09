require('dotenv').config();
let mongoose=require("mongoose");
let express=require("express");
let app=express();
let PORT=process.env.PORT || 6700
let path=require("path");
let userRouter=require("./router/router");
let venueRouter=require("./router/venueRouter");
let cookieParser=require("cookie-parser");
let expressSession=require("express-session");
let flash = require("connect-flash");
let {checkAuth}=require("./middleware/middle");



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(expressSession({ resave : false, saveUninitialized : false, secret : process.env.EXPRESS_SESSION_SECRET,}));
app.use(flash());
app.use(checkAuth("token"));



app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

app.get("/",userRouter);
app.get("/create",userRouter);
app.get("/login",userRouter);
app.get("/logout",userRouter);
app.get("/admin",userRouter);
app.get("/addVenues",userRouter);
app.get("/dashboard",userRouter);
app.get("/message",userRouter);
app.get("/meg/delete/:id",userRouter);
app.get("/team",userRouter);
app.get("/addMember",userRouter);
app.get("/update/:id",userRouter);
app.get("/delete/:id",userRouter);
app.get("/find",userRouter);

app.get("/show/:id",venueRouter);
app.get("/venue/update/:id",venueRouter);
app.get("/venue/delete/:id",venueRouter);
app.get("/cart/:id",venueRouter);
app.get("/conform",venueRouter);
app.get("/showbooking",venueRouter);
app.get("/booking/delete/:id",venueRouter);
app.get("/booking/update/:id",venueRouter);
app.get("/cart",venueRouter);

app.use("/user",userRouter);
app.use("/con",userRouter);
app.use("/dashbord",userRouter);
app.use("/add",userRouter);
app.use("/update",userRouter);

app.use("/venue",venueRouter);
app.use("/ven",venueRouter);
app.use("/turf",venueRouter);
app.use("/us",venueRouter);


mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("mongo connected"));
app.listen(PORT,()=>console.log("server started"));
