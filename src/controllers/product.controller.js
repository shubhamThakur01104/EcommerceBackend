const Product = require('../models/product.model')
const Review = require('../models/review.model')
const User = require('../models/user.model')

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().select(
            "name description price colors sizes images category brand"
        );

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found." });
        }

        return res.status(200).json({
            message: "Products fetched successfully.",
            totalProducts: products.length,
            products,
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            message: "An error occurred while fetching products.",
            error: error.message,
        });
    }
};


const getProductsById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id).select(
            "name description price colors sizes images category brand"
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        return res.status(200).json({
            message: "Product fetched successfully.",
            product,
        });

    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the product.",
            error: error.message,
        });
    }
};

const addProductReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment, rating } = req.body;

        if (!comment || typeof rating !== 'number') {
            return res.status(400).json({
                message: "Comment and numeric rating are required.",
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const review = await Review.create({
            userId: req.user.id,
            productId: id,
            comment,
            rating,
        });

        if (!review) {
            return res.status(400).json({ message: "Failed to submit review" })
        }

        await User.findByIdAndUpdate(
            req.user.id,
            {
                $push: { reviews: review._id }
            },
            {
                new: true
            }
        )

        return res.status(201).json({
            message: "Review submitted successfully.",
            review,
        });

    } catch (err) {
        console.error("Review error:", err);
        return res.status(500).json({
            message: "Internal server error.",
            error: err.message,
        });
    }
};


const getProductReviews = async (req, res) => {
    try {
        const { id } = req.params;

        const reviews = await Review.find({ productId: id })
            .populate({
                path: "userId",
                select: "images name"
            })
            .select("comment rating createdAt");

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this product." });
        }

        return res.status(200).json({
            message: "Reviews fetched successfully.",
            reviews
        });

    } catch (err) {
        console.error("Get Product Reviews Error:", err);
        return res.status(500).json({
            message: "Internal server error.",
            error: err.message
        });
    }
};

const editReview = async (req, res) => {
    try {
        const { reviewid } = req.params;
        const data = req.body;

        // Validate review ID
        if (!reviewid) {
            return res.status(400).json({ message: "Invalid review ID." });
        }

        // Validate input data
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "No data provided for update." });
        }

        const review = await Review.findByIdAndUpdate(
            reviewid,
            data,
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ message: "Review not found or failed to update." });
        }

        return res.status(200).json({
            message: "Review updated successfully.",
            review
        });

    } catch (err) {
        console.error("Edit review error:", err);
        return res.status(500).json({
            message: "Internal server error.",
            error: err.message
        });
    }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewid } = req.params;

    // Validate ID
    if (!reviewid) {
      return res.status(400).json({ message: "Invalid review ID." });
    }

    const review = await Review.findByIdAndDelete(reviewid);

    if (!review) {
      return res.status(404).json({ message: "Review not found or already deleted." });
    }

    await User.findByIdAndUpdate(
        req.user.id,
        {
            $pull: {reviews: review._id}
        },
        {
            new: true
        }
    )

    return res.status(200).json({ message: "Review deleted successfully." });

  } catch (err) {
    console.error("Delete review error:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};


const searchProduct = () => {

}

module.exports = {
    getAllProducts,
    getProductsById,
    searchProduct,
    addProductReview,
    getProductReviews,
    editReview,
    deleteReview
}