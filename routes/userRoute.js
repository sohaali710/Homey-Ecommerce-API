const express = require('express')
const Auth = require('../middleware/auth')
const AdminAuth = require('../middleware/adminAuth')
const { signup, login, logout, logoutFromAllSessions, getProfile, updateProfile } = require('../controllers/userController')

const router = new express.Router()


//#region ***user registration***
router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', Auth, logout)

router.post('/logout-all', Auth, logoutFromAllSessions)



router.get('/profile', Auth, getProfile)

router.put('/profile/update', Auth, updateProfile)


module.exports = router