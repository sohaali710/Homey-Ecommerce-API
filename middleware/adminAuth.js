const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')


// It's a custom middleware that requires a token sent from the frontend, then verify this token //
/** when admin log in we make this auth to save the admin and the token in the req object to use them in 
 * logout routes*/
const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!admin) {
            throw new Error
        }

        req.token = token
        req.admin = admin

        next()

    } catch (error) {
        res.status(401).send({ error: "Authentication required" })
    }
}

module.exports = adminAuth