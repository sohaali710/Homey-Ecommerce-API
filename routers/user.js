const express = require('express')
const User = require('../models/User')
const Auth = require('../middleware/auth')
const AdminAuth = require('../middleware/adminAuth')
const Cart = require('../models/cart')

const router = new express.Router()


//#region ***user registration***
//signup route
router.post('/signup', async (req, res) => {
    try {
        const isUserSignedBefore = await User.findOne({ email: req.body.email })

        if (isUserSignedBefore) {
            res.status(404).send("This user email is already signed in");
            return;
        }

        const user = new User(req.body)

        await user.save()
        const token = await user.generateAuthToken()
        const isAdmin = false;

        res.status(201).send({ user, token, isAdmin })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        const isAdmin = false;

        res.send({ user, token, isAdmin })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/logout', Auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
            //to delete the one that equals to req.token (so log out the user from only this device or this session)
        })

        await req.user.save()
        // console.log("logged out")
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

        // console.log("logged out from all devices")
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

        const isUserSignedBefore = await User.findOne({ email: req.body.email })

        //don't update if the new email is already in db but not equal the auth user email
        if (isUserSignedBefore && (isUserSignedBefore.email != user.email)) {
            res.status(404).send("This user email is already signed in");
            return;
        }

        const updatedUser = await User.updateOne({ _id: user._id }, req.body, { new: true })

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