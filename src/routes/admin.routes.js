const express = require('express')
const { addProducts, updateProduct, deleteProduct, getProducts, restoreProduct } = require('../controllers/admin.controller')
const tokenVerification = require('../middlewares/auth.middleware')
const checkRole = require('../middlewares/role.middleware')
const upload = require('../middlewares/multer.middleware')


const router = express.Router()

router.route('/product').get(tokenVerification,
    checkRole,
    getProducts)

    .post(upload.array('images', 5),
        tokenVerification,
        addProducts)


router.route('/product/:id')
    .put(tokenVerification,
        checkRole,
        updateProduct)

    .delete(checkRole, tokenVerification, deleteProduct)

router.route('/product/restore/:id').get(
    restoreProduct
)


module.exports = router