const v2 = require("cloudinary");
const fs = require("fs/promises");

const fileUploader = async (filepath) => {
    try {
        v2.config({
            cloud_name: process.env.CLOUDNAIRY_CLOUDNAME,
            api_key: process.env.CLOUDNAIRY_APIKEY,
            api_secret: process.env.CLOUDNAIRY_SECRET,
        });

        const uploadResult = await v2.uploader.upload(filepath);
        await fs.unlink(filepath); // delete after successful upload
        return uploadResult.url;
    } catch (error) {
        console.error("Upload Error:", error.message);

        try {
            await fs.unlink(filepath); // attempt to delete even on failure
        } catch (unlinkError) {
            console.error("File deletion failed:", unlinkError.message);
        }

        return null;
    }
};

module.exports = fileUploader;
