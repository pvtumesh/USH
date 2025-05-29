// import dotenv from "dotenv";
// if (process.env.NODE_ENV !== "production") {
//     dotenv.config();    
// } 

import dotenv from "dotenv";
dotenv.config();

import e from "express";
import mongoose from "mongoose";
import { Listing } from "../models/listing.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import warpAsync from "../utils/wrapAsync.js";
import { expressError } from "../utils/expressError.js";
import { listingSchema } from "../joiSchema.js";

import { Review } from "../models/review.js";
import { reviewSchema } from "../joiSchema.js";

import { isLoggedIn } from "../middleware.js";

import { isOwner } from "../middleware.js";

import { validateListing } from "../middleware.js";

import { storage } from "../cloudConfig.js";

import multer from "multer";
// console.log(multer);

// const upload = multer({dest: "uploads/"});
const upload = multer({ storage});

const router = e.Router({ mergeParams: true });

import {
  createListing,
  destroyListing,
  editListing,
  index,
  renderNewForm,
  showListing,
  updateListing,
} from "../controllers/listings.js";

// // Listings Validation function using Joi Schema
// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(",");
//         throw new expressError(msg, 400);
//     } else {
//         next();
//     }}

// Index Route and Create Route

router
  .route("/")
  .get(warpAsync(index))
  .post(isLoggedIn,  upload.single("image"), validateListing,warpAsync(createListing));
  // .post(upload.single("image"),(req, res) => {
  //   console.log(req.file);
  //   console.log(req.body);
  //   res.send("success");
  // });




// New Route
router.get("/new", isLoggedIn, renderNewForm);


// Show , Update and Delete Route
router.route("/:id")
.get(warpAsync(showListing))
.put(isLoggedIn, isOwner, upload.single("image"), warpAsync(updateListing))
.delete(isLoggedIn, isOwner, warpAsync(destroyListing))


// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, warpAsync(editListing));



// router.get("/testlisting", async (req, res) => {
//     let samplelisting = new Listing({
//         title: "Urban Stay Hub",
//         description: "New Our beach",
//         price: 12000,
//         location: "sector 14, Gurugon",
//         country: "India"
//     })
//     await samplelisting.save();
//     // console.log("sample was created successfully");
//     res.send("successfull testing");
// })

export default router;
