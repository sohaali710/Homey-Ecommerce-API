const express = require('express')
const multer = require('multer')
const path = require('path')
const router = new express.Router()


const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `HomeyFurniture_${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

router.post('', upload.single('file'), async (req, res, next) => {
    const file = req.file;
    console.log(file.filename);

    try {
        if (!file) {
            res.status(400).send({ error: "No file exists" })
        }

        res.status(200).send(file)
    } catch (error) {
        res.status(400).send(error)
    }
})

//upload multiple files
router.post('/multiple', upload.array('files'), async (req, res, next) => {
    const files = req.files;
    console.log(files);

    try {
        if (!files) {
            res.status(400).send({ error: "No files exist" })
        }

        res.status(200).send(files)
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router