import dotenv from "dotenv";
if (process.env.NODE_ENV != "production") {
    dotenv.config();    
}

// import cloudinary from "cloudinary";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

// console.log("Cloudinary Configured");

// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'USH_Project',
      allowed_formats  : async (req, file) => ['jpg', 'png', 'jpeg'], // supports promises as well
    //   public_id: (req, file) => 'computed-filename-using-request',
    },
  });

export { cloudinary, storage}