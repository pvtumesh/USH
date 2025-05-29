import e from "express";
import mongoose from "mongoose";
import { Listing } from "../models/listing.js";
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import warpAsync from "../utils/wrapAsync.js";
import { expressError } from "../utils/expressError.js";
import { listingSchema } from "../joiSchema.js";

import { Review } from "../models/review.js";
import { reviewSchema } from "../joiSchema.js";

import { isLoggedIn, validateReview, isReviewOwner } from "../middleware.js";

const router = e.Router({ mergeParams: true});

const createReview = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing);

    const review = new Review(req.body);
    // console.log(review);
    review.author = req.user._id;
    // console.log(review);

    listing.reviews.push(review);
    const savedReview = await review.save();
    const savedListing = await listing.save();

    // console.log(savedReview);
    // console.log(savedListing);
    req.flash("success", "Successfully added review");

    res.redirect(`/listings/${id}`);
  }

const destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);
    const review = await Review.findByIdAndDelete(reviewId);
    listing.reviews.remove(review);
    await listing.save();
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
  }

export { createReview, destroyReview };