const express = require('express')
const Admin = require('../models/Admin')
const AdminAuth = require('../middleware/adminAuth')

const router = new express.Router()


//#region admin login and logout
router.post('/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAdminAuthToken()
        const isAdmin = true;

        res.send({ admin, token, isAdmin })
    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }
})

router.post('/logout', AdminAuth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.admin.save()
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

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
//#endregion admin login and logout

//#region CRUD operations on admins data
router.post('/newAdmin', async (req, res) => {
    const admin = new Admin(req.body)
    // console.log(req.body)

    try {
        await admin.save()
        const token = await admin.generateAdminAuthToken()

        const isAdmin = true;

        // console.log("admin signed up successfully")
        res.status(201).send({ admin, token, isAdmin })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get("/", async (req, res) => {
    try {
        const admins = await Admin.find({});

        if (!admins) {
            res.status(404).send("No admins found");
        }

        res.status(201).send(admins);
    } catch (error) {
        res.status(400).send("invalid request");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const admin = await Admin.findOne({ _id: req.params.id })

        if (!admin) {
            res.status(404).send({ error: "Admin not found" })
        }

        res.status(200).send(admin)

    } catch (error) {
        res.status(400).send(error)
    }
});

router.put("/:id", async (req, res) => {
    try {
        const admin = await Admin.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })

        await admin.save()
        res.status(200).send({ admin })
    } catch (error) {
        res.status(400).send(error)
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Admin.findOneAndDelete({ _id: req.params.id })

        res.status(200).send()
    } catch (error) {
        res.status(400).send(error)
    }
});
//#endregion CRUD operations on admins data



module.exports = router