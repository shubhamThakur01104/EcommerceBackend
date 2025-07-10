// controllers/product.controller.js

const Product = require("../models/product.model");
const { v4: uuidv4 } = require("uuid");
const fileUploader = require("../utils/cloudinary");
const mongoose = require("mongoose");

/**
 * GET: Fetch all active (non-deleted) products
 */
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false });
        if (!products.length) {
            return res.status(204).json({ message: "No products found." });
        }
        return res.status(200).json({ products });
    } catch (err) {
        console.error("Get Products Error:", err.message);
        return res.status(500).json({ message: "Server error while fetching products." });
    }
};

/**
 * POST: Add new product with optional image upload
 */
const addProducts = async (req, res) => {
    try {
        /* --------- 1. Pull & validate body --------- */
        const {
            name,
            description,
            price,
            brand,
            stockAmount,
            category,
            colors,
            sizes,
        } = req.body;


        if (!name || !description || !price || !brand || !stockAmount || !category) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }




        /* --------- 2. Normalise & de‑dupe check --------- */
        const normalizedName = name.trim().toLowerCase();
        const normalizedCategory = category.trim().toLowerCase();

        const existing = await Product.findOne({
            name: normalizedName,
            category: normalizedCategory,
            colors: colors.length ? { $all: colors } : undefined,
            sizes: sizes.length ? { $all: sizes } : undefined,
        });

        if (existing) {
            return res.status(409).json({ message: 'Product already exists.' });
        }

        /* --------- 3. Handle file upload safely --------- */

        const uploadPromises = req.files.map(file => fileUploader(file.path));

        if (!uploadPromises || uploadPromises.length === 0) {
            return res.status(400).json({ message: "No files were uploaded." });
        }


        const uploadedImages = await Promise.all(uploadPromises);

        /* --------- 4. Create product --------- */
        const sku = `${uuidv4()}`;   // ← back‑ticks

        const product = await Product.create({
            _id: sku,
            name: normalizedName,
            description: description.trim().toLowerCase(),
            price,
            brand: brand.trim().toLowerCase(),
            stockAmount,
            category: normalizedCategory,
            colors: colors.toLowerCase(),
            sizes: sizes.toUpperCase(),
            images: uploadedImages,
        });

        return res.status(201).json({ message: 'Product added successfully.', product });

    } catch (err) {
        console.error('Add Product Error:', err);
        return res.status(500).json({ message: 'Server error while adding product.' });
    }
};

/**
 * PUT: Update existing product
 */
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;


    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        return res.status(200).json({ message: "Product updated successfully.", product: updatedProduct });
    } catch (err) {
        console.error("Update Product Error:", err.message);
        return res.status(500).json({ message: "Server error while updating product." });
    }
};

/**
 * DELETE: Soft, permanent, or bulk delete products
 */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productDelete } = req.body;

        if (!productDelete || !["temporary", "permanent"].includes(productDelete)) {
            return res.status(400).json({ message: "Invalid or missing 'productDelete' action." });
        }

        if (productDelete === "temporary") {
            const product = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            if (!product) return res.status(404).json({ message: "Product not found." });
            return res.status(200).json({ message: "Product soft-deleted successfully.", product });
        }

        if (productDelete === "permanent") {
            const product = await Product.findByIdAndDelete(id);
            if (!product) return res.status(404).json({ message: "Product not found." });
            return res.status(200).json({ message: "Product permanently deleted.", product });
        }

        if (productDelete === "all") {
            const result = await Product.deleteMany({ isDeleted: true });
            return res.status(200).json({ message: `${result.deletedCount} soft-deleted products removed.` });
        }
    } catch (err) {
        console.error("Delete Product Error:", err.message);
        return res.status(500).json({ message: "Server error while deleting product." });
    }
};

/**
 * PATCH: Restore soft-deleted product
 */
const restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ message: "Invalid product ID format." });
        // }

        const product = await Product.findByIdAndUpdate(id, { isDeleted: false, updatedAt: new Date() }, { new: true });

        if (!product) {
            return res.status(404).json({ message: "Product not found or already active." });
        }

        return res.status(200).json({ message: "Product restored successfully.", product });
    } catch (err) {
        console.error("Restore Product Error:", err.message);
        return res.status(500).json({ message: "Server error while restoring product." });
    }
};

module.exports = {
    getProducts,
    addProducts,
    updateProduct,
    deleteProduct,
    restoreProduct
};
