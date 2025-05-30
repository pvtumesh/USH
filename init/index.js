import mongoose from "mongoose";
import { Listing } from "../models/listing.js";
import { sampleListings } from "./data.js";


// connecting to Database
const MONGO_URL = "mongodb://127.0.0.1:27017/USH";
main().then(() => {
    // console.log("connected to DB");   
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    const updatedListings  = sampleListings.map((obj) => ({...obj, owner: "681466e8a83de1f8b490a4f8"}));
    await Listing.insertMany(updatedListings);
    console.log(updatedListings); 
}

initDB();