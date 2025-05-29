import { Listing } from "./models/listing.js";
import { Review } from "./models/review.js";
import { listingSchema } from "./joiSchema.js";
import { expressError } from "./utils/expressError.js";
import { reviewSchema } from "./joiSchema.js";




const isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    // console.log(req);
    
    if (!req.isAuthenticated()) {
        // console.log(req.path, req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

const isOwner = async(req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "🔐 You do not have permission to do that.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

    // Listings Validation function using Joi Schema
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new expressError(msg, 400);
    } else {
        next();
    }}

// Reviews Validation function using Joi Schema
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new expressError(msg, 400);
    } else {
        next();
    }}


// only owner can delete the Review
const isReviewOwner = async(req, res, next) => {
    const { id, reviewId } = req.params;
    // let review = await Review.findById(id);
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "🔐 You do not have permission to do that.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

export { isLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview, isReviewOwner };