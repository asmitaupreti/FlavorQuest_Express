import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
   try {
      if (!localPath) return null;
      const response = await cloudinary.uploader.upload(localPath, {
         resource_type: "image",
      });
      // file has been uploaded successfull
      //console.log("file is uploaded on cloudinary ", response.url);
      fs.unlinkSync(localPath);
      return response;
   } catch (error) {
      fs.unlinkSync(localPath); // remove the locally saved temporary file as the upload operation got failed
      return null;
   }
};

const deleteFromCloudinary = async (public_id) => {
   try {
      if (!public_id) return null;
      const response = await cloudinary.uploader.destroy(public_id, {
         invalidate: true,
         resource_type: "image",
      });
      return response;
   } catch (error) {
      return null;
   }
};
export { uploadOnCloudinary, deleteFromCloudinary };
