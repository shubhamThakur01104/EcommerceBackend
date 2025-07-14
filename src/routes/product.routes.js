const express = require('express')
const { getAllProducts, getProductsById, addProductReview, getProductReviews, editReview, deleteReview } = require('../controllers/product.controller')
const tokenVerification = require('../middlewares/auth.middleware')
const isTokenBlacklisted = require('../middlewares/logout.middleware')

const router = express.Router()

router.route('/').get(getAllProducts)
router.route('/:id').get(getProductsById)
router.route('/:id/review').post(tokenVerification, isTokenBlacklisted, addProductReview);
router.route('/:id/reviews').get(getProductReviews);
router.route('/:reviewid').patch(tokenVerification, isTokenBlacklisted, editReview)
router.route('/:reviewid').delete(tokenVerification, isTokenBlacklisted, deleteReview)

module.exports = router