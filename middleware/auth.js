const jwt = require('jsonwebtoken')
const User = require('../models/User')


// It's a custom middleware that requires a token sent from the frontend, then verify this token //
/** when user log in we make this auth to save the user and the token in the req object to use them in 
 * logout routes*/
const auth = async (req, res, next) => {
  try {
    //get the token from header from Authorization key and verify it with the one in the db
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

    if (!user) {
      throw new Error
    }

    req.token = token
    req.user = user

    next()

  } catch (error) {
    res.status(401).send({ error: "Authentication required" })
  }
}

module.exports = auth