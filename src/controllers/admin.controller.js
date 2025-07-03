const Product = require("../models/product.model");
const { v4: uuidv4 } = require('uuid');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        if (!products || products.length === 0) {
            return res.status(204).json({ message: "No Data" })
        }
        return res.status(200).json({ products })
    }
    catch (err) {
        console.error("Get Products Error:", err.message);
        return res.status(500).json({ message: "Server error while fetching products." });
    }
}

const addProducts = async (req, res) => {
    const {
        name,
        description,
        price,
        brand,
        stockAmount,
        category,
        colors = [],
        sizes = [],
        isFeatured
    } = req.body;

    try {
        const normalizedName = name.trim().toLowerCase();
        const normalizedCategory = category.trim().toLowerCase();

        // Check if product already exists
        const existingProduct = await Product.findOne({
            name: normalizedName,
            category: normalizedCategory,
            colors: { $all: colors.sort() },
            sizes: { $all: sizes.sort() }
        });

        if (existingProduct) {
            return res.status(409).json({ message: "Product is already registered." });
        }

        const sku = `PROD-${uuidv4()}`;

        const addedProduct = await Product.create({
            name: normalizedName,
            description: description.trim(),
            price,
            brand: brand.trim(),
            stockAmount,
            category: normalizedCategory,
            colors,
            sizes,
            isFeatured: !!isFeatured,
            _id: sku
        });

        return res.status(201).json({
            message: "Product added successfully.",
            product: addedProduct
        });
    } catch (err) {
        console.error("Add product error:", err.message);
        return res.status(500).json({ message: "Server Error while adding products." });
    }
};


const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product does not exist." });
        }

        return res.status(200).json({
            message: "Product updated successfully.",
            product: updatedProduct,
        });
    } catch (err) {
        console.error("Update Product Error:", err.message);
        return res.status(500).json({ message: "Server error in updating product" });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product does not exist." });
        }

        product.isDeleted = true;
        await product.save();

        return res.status(200).json({ message: "Product deleted successfully." });

    } catch (err) {
        console.error("Delete Product Error:", err.message);
        return res.status(500).json({ message: "Server error in deleting product" });
    }
};


module.exports = {
    getProducts,
    addProducts,
    updateProduct,
    deleteProduct
};
