const express = require('express')

const {getAllCartItems, addCartItems, deleteCartItems} = require('../controllers/cart.controller')
const tokenVerification = require('../middlewares/auth.middleware')

const router = express.Router()

router.route('/items').get(tokenVerification ,getAllCartItems).post(tokenVerification,addCartItems)

router.route('/items/:id').delete(deleteCartItems)

module.exports = router