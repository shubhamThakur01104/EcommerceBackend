const express = require('express')
const { getAllProducts, getProductsById, searchProduct, addProductReview, getProductReviews, editReview, deleteReview } = require('../controllers/product.controller')
const tokenVerification = require('../middlewares/auth.middleware')

const router = express.Router()

router.route('/').get(getAllProducts)
router.route('/:id').get(getProductsById)
router.route('/:id/review').post(tokenVerification, addProductReview);
router.route('/:id/reviews').get(getProductReviews);
router.route('/:reviewid').patch(tokenVerification, editReview)
router.route('/:reviewid').delete(tokenVerification, deleteReview)
router.route('/products/search').get(searchProduct)

module.exports = router