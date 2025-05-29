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

const router = e.Router({ mergeParams: true });

const index = async (req, res) => {
  const allListings = await Listing.find({});
  // res.send(allListings);
  // console.log(allListings);

  res.render("listings/index.ejs", { allListings });
};

const renderNewForm = (req, res) => {
  // console.log(req.user);

  // if(!req.isAuthenticated()){
  //     req.flash("error", "You must be logged in to create a listing");
  //     return res.redirect("/login");
  // }
  res.render("listings/new.ejs");
};

const createListing = async (req, res, next) => {
  // if (
  //   !req.body.title ||
  //   !req.body.description ||
  //   !req.body.image ||
  //   !req.body.price ||
  //   !req.body.location ||
  //   !req.body.country
  // ) {
  //   throw new expressError("All fields are required", 400);
  // }

  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, filename);
  
  const { title, description, image, price, location, country } = req.body;
  const listing = new Listing({
    title,
    description,
    image,
    price,
    location,
    country,
  });
  listing.owner = req.user._id; // it's work is that it will store the id of the user who created the listing
  req.flash("success", "Successfully created listing");
  // upload file
  listing.image = { url, filename };
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
  res.redirect("/listings");
};

const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(listing);

  if (!listing) {
    // throw new expressError(404, "Listing not found");
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

const editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing);
  if (!listing) {
    // throw new expressError(404, "Listing not found");
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

const updateListing = async (req, res) => {
  let { id } = req.params;
  const { title, description, image, price, location, country } = req.body;

  // let listing = await Listing.findById(id);
  // if (!listing.owner._id.equals(req.user._id)) {
  //     req.flash("error", "You do not have permission to edit this listing");
  //     return res.redirect(`/listings/${id}`);
  // }
  const listing =await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image,
    price,
    location,
    country,
  });
  if (typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, filename);
  listing.image = { url, filename };
  await listing.save();
  }
  req.flash("success", "Successfully Updated listing");
  res.redirect(`/listings/${id}`);
};

const destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted listing");
  res.redirect("/listings");
};

export {
  index,
  renderNewForm,
  showListing,
  createListing,
  editListing,
  updateListing,
  destroyListing,
};
