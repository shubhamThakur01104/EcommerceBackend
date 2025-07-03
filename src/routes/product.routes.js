const express = require('express')
const {getAllProducts, getProductsById, searchProduct} = require('../controllers/product.controller')

const router = express.Router()

router.route('/products').get(getAllProducts)
router.route('/products/:id').get(getProductsById)
router.route('/products/search').get(searchProduct)

module.exports = router