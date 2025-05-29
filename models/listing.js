import mongoose from "mongoose";
import { Review } from "./review.js";

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
        // type: String,
        // default: "https://fastly.picsum.photos/id/367/536/354.jpg?hmac=I9t4SUy2NyD9XLkXv_vfD44McKF3yKCLCezVcVbfKko",
        // set: (v) => v==="" ? "https://fastly.picsum.photos/id/367/536/354.jpg?hmac=I9t4SUy2NyD9XLkXv_vfD44McKF3yKCLCezVcVbfKko" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing.reviews.length) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        })
    }
});


const Listing = mongoose.model("Listing", listingSchema);

export { Listing };

