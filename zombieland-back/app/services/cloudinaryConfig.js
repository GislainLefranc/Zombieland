import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // API secret
});

export default cloudinary;
