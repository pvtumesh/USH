import dotenv from "dotenv";
if(process.env.NODE_ENV != "production") {
    dotenv.config();
}

// console.log(process.env.CLOUDINARY_CLOUD_NAME);


import e from "express";
import mongoose from "mongoose";
import { Listing } from "./models/listing.js";

import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import warpAsync from "./utils/wrapAsync.js";
import { expressError } from "./utils/expressError.js";
import { listingSchema } from "./joiSchema.js";

import { Review } from "./models/review.js";
import { reviewSchema } from "./joiSchema.js";

import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js";
import usersRouter from "./routes/user.js";

import session from "express-session";
import monogStore from "connect-mongo";
// import flash from "connect-flash";
import flash from "express-flash";

import passport from "passport";
import localStrategyPassportLocal from "passport-local"
import {User} from "./models/user.js";


// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = e(); //starting express app

app.use(e.json());  // JSON data ko parse karne ke liye
app.use(e.urlencoded({ extended: true }));  // URL-encoded data ko parse karne ke liye

// Method-Override
app.use(methodOverride("_method"));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS-Mate
app.engine("ejs", ejsMate);

// Serving static files
app.use(e.static(path.join(__dirname, "public")));


// connecting to Database
// const MONGO_URL = "mongodb://127.0.0.1:27017/USH";

let dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    // console.log("connected to DB");   
}).catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

async function main() {
  await mongoose.connect(dbUrl);
}

const store = monogStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategyPassportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

// app.get("/demouser", async (req, res) => {
//     const user = new User({ 
//         email: "1Kt9e@example.com", 
//         username: "demouser" 
//     });

//     const registeredUser = await User.register(user, "demouser");
//     // user.setPassword("demouser");
//     // user.save();

//     res.send(registeredUser);
// })

// app.get("/", (req, res) => {
//     res.send("Server is working");
// })

// listings Route
app.use("/listings", listingRouter);


// Reviews Route
app.use("/listings/:id/reviews", reviewRouter);

// users Route
app.use("/", usersRouter);


app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    console.error(err); // ✅ Show full error in console
    res.status(statusCode).render("listings/error.ejs", { statusCode, message, err });
});


// app.use( (err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong"} = err;
//     res.render("listings/error.ejs", { statusCode, message, err });
//     // res.status(statusCode).send(message);
// })

app.listen(8080, ()=> {
    // console.log("server is listening on port 8080");
})

