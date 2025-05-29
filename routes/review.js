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

import { isLoggedIn, validateReview, isReviewOwner } from "../middleware.js";
import { createReview, destroyReview } from "../controllers/reviews.js";

const router = e.Router({ mergeParams: true });

// // Reviews Validation function using Joi Schema
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(",");
//         throw new expressError(msg, 400);
//     } else {
//         next();
//     }}

// Reviews
router.post("/", isLoggedIn, validateReview, warpAsync(createReview));

//delete review Route
router.delete("/:reviewId",isLoggedIn,isReviewOwner,warpAsync(destroyReview));

export default router;
