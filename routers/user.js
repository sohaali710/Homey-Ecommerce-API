const express = require('express')
const User = require('../models/User')
const Auth = require('../middleware/auth')
const AdminAuth = require('../middleware/adminAuth')
const Cart = require('../models/cart')

const router = new express.Router()


//#region ***user registration***
//signup route
router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    // console.log(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()

        console.log("user signed up successfully")
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

//login route
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        console.log("user logged in")
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
        // console.log(error)
    }
})

//logout route
router.post('/logout', Auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
            //to delete the one that equals to req.token (so log out the user from only this device or this session)
            //**Notice that we used req.user.tokens (same as user schema model) and req.token (attach with the req from the frontend)*/
        })

        await req.user.save()
        console.log("logged out")
        res.send()

    } catch (error) {
        res.status(500).send()
    }
})

//the previous logout route only logs the user out of the current session
//to fix that we use logout all :
//logout from all devices (clears the entire tokens array)
router.post('/logoutAll', Auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        console.log("logged out from all devices")
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
//#endregion  ***user registration***


//#region  ***user profile***
//get profile
router.get('/profile', Auth, async (req, res) => {
    try {
        const { user, token } = req

        res.status(201).send({ user, token })
    } catch (error) {
        res.status(500).send()
    }
})

//update profile
router.put('/profile/update', Auth, async (req, res) => {
    try {
        const { user, token } = req

        const updatedUser = await User.findByIdAndUpdate({ _id: user._id }, req.body, { new: true })

        await updatedUser.save()
        res.status(201).send({ updatedUser, token })

    } catch (error) {
        res.status(500).send()
    }
})
//#endregion  ***user profile***


//#region  ***get user by cart owner [admin] ***
router.get('/cartOwner/:id', AdminAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ _id: req.params.id });
        const userId = cart.owner;
        const user = await User.findOne({ _id: userId });

        res.status(201).send({ user })
    } catch (error) {
        res.status(500).send()
    }
})
//#endregion  ***get user by cart owner***


module.exports = router