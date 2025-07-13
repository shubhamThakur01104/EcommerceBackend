const express = require('express')
const { signUp, login, updateProfile } = require('../controllers/auth.controller')
const tokenVerification = require('../middlewares/auth.middleware')


const router = express.Router()

router.route('/signup').post(signUp)
router.route('/login').post(login)
router.route('/updateprofile').patch(tokenVerification, updateProfile)

module.exports = router