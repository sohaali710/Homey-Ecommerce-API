const express = require('express')

exports.uploadSingleFile = async (req, res, next) => {
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
}

exports.uploadMultipleFiles = async (req, res, next) => {
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
}