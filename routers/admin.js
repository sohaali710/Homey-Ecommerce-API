const express = require('express')
const Admin = require('../models/Admin')
const AdminAuth = require('../middleware/adminAuth')

const router = new express.Router()


/********** CRUD operations on admins data *********/
//add new admin
router.post('/newAdmin', async (req, res) => {
    const admin = new Admin(req.body)
    console.log(req.body)

    try {
        await admin.save()
        const token = await admin.generateAdminAuthToken()

        // console.log("admin signed up successfully")
        res.status(201).send({ admin, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

//get all admins
router.get("/", async (req, res) => {
    const admins = await Admin.find({});
    res.json(admins);
});

//get one admin
router.get("/:id", (req, res) => {
    Admin.findOne({ _id: req.params.id })
        .then((response) => {
            res.json(response);
        })
        .catch((err) => res.json({ message: 'An error occurred' }));
});

//update admin
router.put("/:id", (req, res) => {
    Admin.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
    })
        .then((response) => res.json(response))
        .catch((err) => res.json({ message: 'An error occurred' }));
});

//delete admin
router.delete("/:id", (req, res) => {
    Admin.findOneAndDelete({ _id: req.params.id })
        .then((response) => {
            res.json({ message: response });
        })
        .catch((err) => res.json({ message: 'An error occurred' }));
});


/********** admin login and logout *********/
//login route
router.post('/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAdminAuthToken()

        // console.log("admin logged in")
        res.send({ admin, token })
    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }
})

//logout route
router.post('/logout', AdminAuth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.admin.save()
        // console.log("logged out")
        res.send()

    } catch (error) {
        res.status(500).send()
    }
})

//logout from all sessions
router.post('/logoutAll', AdminAuth, async (req, res) => {
    try {
        req.admin.tokens = []
        await req.admin.save()

        // console.log("logged out from all devices")
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router