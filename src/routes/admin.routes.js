const express = require('express')
const { addProducts, updateProduct, deleteProduct } = require('../controllers/admin.controller')
const tokenVerification = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')
const checkRole = require('../middlewares/role.middleware')


const router = express.Router()

router.route('/products').post(tokenVerification, checkRole, addProducts)
router.route('/products/:id')
    .put(tokenVerification, checkRole, updateProduct)
    .delete(tokenVerification, checkRole, deleteProduct)

router.route('/test').get(
    tokenVerification,
    checkRole,
    (req, res) => {
        res.send("This is the admin route.")
    })

module.exports = router