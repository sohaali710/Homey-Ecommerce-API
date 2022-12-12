const express = require('express')
const Product = require('../models/Product')
const Auth = require('../middleware/auth')
const AdminAuth = require('../middleware/adminAuth')

const router = new express.Router()

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})

        res.status(200).send(products)
    } catch (error) {
        res.status(400).send(error)
    }
}

router.get('/all', getAllProducts); // TODO: Replace it with (/user/allProducts,/admin/allProducts) in frontend


//#region GET [User]
router.get('/user/allProducts', Auth, getAllProducts);
//add review
router.put("/reviews/:id", Auth, async (req, res) => {
    try {
        const { _id: userId, name } = req.user
        const { rating, comment } = req.body

        const product = await Product.findOne({ _id: req.params.id })
        // console.log(product)
        if (!product) {
            res.status(404).send({ error: "Product not found" })
        }

        let date = new Date();

        let { reviews, ratingAvg } = product
        reviews.push({ name, rating, comment, userId, date })

        const totalReviews = reviews.reduce((acc, curr, arr) => {
            return (acc + curr.rating);
        }, 0)

        product.ratingAvg = Math.round(totalReviews / reviews.length)

        await product.save()
        res.status(200).send({ reviews, ratingAvg })
    } catch (error) {
        res.status(400).send(error)
    }
})
//#endregion GET [User]

//#region GET [Any one without Auth]
router.get('/promotions', async (req, res) => {
    try {
        const products = await Product.find({})

        res.status(200).send(products)
    } catch (error) {
        res.status(400).send(error)
    }
})

//TODO: without Auth (promotions only) it still get the all products, you should edit it.
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id })

        if (!product) {
            res.status(404).send({ error: "Product not found" })
        }

        res.status(200).send(product)

    } catch (error) {
        res.status(400).send(error)
    }
})
//TODO:same as previous one
router.get('/category/:name', async (req, res) => {
    try {
        const productsByCategory = await Product.find({ category: req.params.name })

        if (!productsByCategory) {
            res.status(404).send({ error: "Category not found" })
        }

        res.status(200).send(productsByCategory)

    } catch (error) {
        res.status(400).send(error)
    }
})
//#endregion GET [Any one without Auth]


//#region [only accessed by Admin]
// router.get('/admin/allProducts', AdminAuth, getAllProducts);
router.post('/newProduct', AdminAuth, async (req, res) => {
    try {
        // console.log(req.body)
        const product = new Product(req.body)

        await product.save()
        res.status(200).send({ product })

    } catch (error) {
        res.status(400).send(error)
    }

})

//admin update product
router.put("/:id", AdminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        // console.log(product)

        await product.save()
        res.status(200).send({ product })
    } catch (error) {
        res.status(400).send(error)
    }
})

//add promotions to product
router.put("/promotions/:id", AdminAuth, async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate({ _id: req.params.id }, { promotions: true }, { new: true })
        console.log(product)

        if (!product) {
            res.status(404).send({ error: "Product not found" })
        }

        await product.save()
        res.status(200).send({ product })
    } catch (error) {
        res.status(400).send(error)
    }
})

// admin delete product
router.delete("/:id", AdminAuth, async (req, res) => {
    try {
        await Product.findByIdAndRemove({ _id: req.params.id })

        res.status(200).send()
    } catch (error) {
        res.status(400).send(error)
    }
})
//#endregion [only accessed by Admin]




//#region [db]
// add list of products 
router.post('/addListOfProducts', AdminAuth, async (req, res) => {
    try {
        const products = await Product.insertMany(req.body)

        await product.save()
        res.status(200).send({})

    } catch (error) {
        res.status(400).send(error)
    }

})
//#endregion [db]


module.exports = router
