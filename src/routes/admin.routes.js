const express = require('express')
const { addProducts, updateProduct, deleteProduct, getProducts, restoreProduct, deleteProductsByCategory, getAllUsers } = require('../controllers/admin.controller')
const tokenVerification = require('../middlewares/auth.middleware')
const checkRole = require('../middlewares/role.middleware')
const upload = require('../middlewares/multer.middleware')
const isTokenBlacklisted = require('../middlewares/logout.middleware')


const router = express.Router()

router.route('/product').get(getProducts)

    .post(upload.array('images', 5),
        tokenVerification,
        checkRole,
        addProducts)


router.route('/product/:id')
    .patch(tokenVerification,
        isTokenBlacklisted,
        checkRole,
        updateProduct)

    .delete(checkRole, isTokenBlacklisted, tokenVerification, deleteProduct)

router.route('/delete/category').delete(checkRole, isTokenBlacklisted, tokenVerification, deleteProductsByCategory)


router.route('/product/restore/:id').patch(checkRole,isTokenBlacklisted, tokenVerification,
    restoreProduct
)

router.route('/allusers').get(tokenVerification,isTokenBlacklisted, checkRole, getAllUsers)

module.exports = router