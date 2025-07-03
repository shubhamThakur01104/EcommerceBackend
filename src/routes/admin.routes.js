const express = require('express')
const { addProducts, updateProduct, deleteProduct, getProducts } = require('../controllers/admin.controller')
const tokenVerification = require('../middlewares/auth.middleware')
const checkRole = require('../middlewares/role.middleware')


const router = express.Router()

router.route('/products').get(tokenVerification, checkRole, getProducts).post(tokenVerification, checkRole, addProducts)
router.route('/products/:id')
    .put(tokenVerification, checkRole, updateProduct)
    .delete(tokenVerification, checkRole, deleteProduct)


module.exports = router