const express = require('express')
const { signUp, login, updateProfile, refreshToken, logout } = require('../controllers/auth.controller')
const tokenVerification = require('../middlewares/auth.middleware')
const isTokenBlacklisted = require('../middlewares/logout.middleware')


const router = express.Router()

router.route('/signup').post(signUp)
router.route('/login').post(login)
router.route('/refresh-token').post(refreshToken)
router.route('/updateprofile').patch(tokenVerification,isTokenBlacklisted, updateProfile)
router.route('/logout').patch(tokenVerification, logout)

module.exports = router