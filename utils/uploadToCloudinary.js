import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import dotenv from "dotenv";
dotenv.config();

const uploadToCloudinary = (buffer, folder = "grocery") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export default uploadToCloudinary;