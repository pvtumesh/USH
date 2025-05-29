import joi from "joi";

// ye tb use karna hota hai jb HTML se data listing[title], listing[description], listing[image], listing[price], listing[location], listing[country] ko parse karna hai

// const listingSchema = joi.object({
//     listing: joi.object({
//     title: joi.string().required(),
//     description: joi.string().required(),
//     image: joi.string().allow("", null),
//     price: joi.number().required(),
//     location: joi.string().required(),
//     country: joi.string().required()
// }).required(),
// })

// const reviewSchema = joi.object({
//     review: joi.object({
//         rating: joi.number().min(1).max(5).required(),
//         comment: joi.string().required()
//     }).required()
// })


// ye direct title, description, image, price, location, country ko parse karna hai

const listingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().allow("", null),
    price: joi.number().required(),
    location: joi.string().required(),
    country: joi.string().required()
})

const reviewSchema = joi.object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().required()
})


export { listingSchema, reviewSchema };