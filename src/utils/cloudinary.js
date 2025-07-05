const v2 = require("cloudinary");
const fs = require("fs/promises"); // Use promises version of fs

const fileUploader = async (filepath) => {
    try {
        // Cloudinary configuration
        v2.config({
            cloud_name: process.env.CLOUDNAIRY_CLOUDNAME,
            api_key: process.env.CLOUDNAIRY_APIKEY,
            api_secret: process.env.CLOUDNAIRY_SECRET,
        });

        // Upload file to Cloudinary
        const uploadResult = await v2.uploader.upload(filepath);

        // Delete local file after upload
        await fs.unlink(filepath);

        // Return uploaded file URL
        return uploadResult.url;
    } 
    catch (error) {
        console.error("Upload Error:", error.message);
        return null;
    }
};

module.exports = fileUploader;
