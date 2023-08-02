const express = require('express')
const router = new express.Router()

const AdminAuth = require('../middleware/adminAuth')
const { login, logout, createAdmin, getAllAdmins, getAdminData, updateAdminData, deleteAdminData } = require('../controllers/adminController')

router.post('/login', login)
router.post('/logout', AdminAuth, logout)

//#region CRUD operations on admins
router.post('/newAdmin', createAdmin)
router.get("/", getAllAdmins)
router.get("/:id", getAdminData)
router.put("/:id", updateAdminData)
router.delete("/:id", deleteAdminData)

module.exports = router