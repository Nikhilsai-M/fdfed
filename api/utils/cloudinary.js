import { v2 as cloudinary } from 'cloudinary';
import streamifier from "streamifier";
cloudinary.config({
  cloud_name: 'dqohkpeyp',
  api_key: '932324182493947',
  api_secret: 'PigT_hhRRKDi0utHVEQpmZ2kiIo',
  secure: true 
});

console.log('✅ Cloudinary configured with direct credentials');

export const uploadToCloudinary = async (filePath, folder = 'laptops') => {
  try {
    console.log(`📤 Uploading to Cloudinary: ${filePath}, folder: ${folder}`);
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `electronic_trade/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    
    console.log(`✅ Upload successful: ${result.secure_url}`);
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error details:', {
      message: error.message,
      http_code: error.http_code,
      name: error.name
    });
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
};

export const uploadBufferToCloudinary = (buffer, folder = "seller-products") => {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `electronic_trade/${folder}`,
        resource_type: "auto",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" }
        ]
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Deleted from Cloudinary: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw error;
  }
};

export default cloudinary;