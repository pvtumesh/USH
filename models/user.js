import mongoose from "mongoose";

import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    }
    // username & password are provided by passport-local-mongoose plugin by default
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export { User };