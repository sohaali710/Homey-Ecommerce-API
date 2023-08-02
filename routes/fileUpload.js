const express = require('express')
const multer = require('multer')
const path = require('path')
const router = new express.Router()
const { uploadSingleFile, uploadMultipleFiles } = require('../controllers/fileUploadController')

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `HomeyFurniture_${file.originalname}`)
    }
})

const upload = multer({ storage: storage })


router.post('', upload.single('file'), uploadSingleFile)
router.post('/multiple', upload.array('files'), uploadMultipleFiles)

module.exports = router