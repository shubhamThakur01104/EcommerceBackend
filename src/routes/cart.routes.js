const express = require('express')

const {addCartItems} = require('../controllers/cart.controller')
const tokenVerification = require('../middlewares/auth.middleware')

const router = express.Router()

router.route('/items').post(tokenVerification,addCartItems)

// router.route('/items/:id').delete(deleteCartItems)

module.exports = router