const express = require("express");
const Favorites = require('../models/Favorites')
const Product = require('../models/Product')
const Auth = require("../middleware/auth");

const router = new express.Router();

//get user favorite products
router.get("", Auth, async (req, res) => {
    const owner = req.user._id;

    try {
        const favorites = await Favorites.findOne({ owner });

        if (favorites && favorites.items.length > 0) {
            res.status(200).send(favorites);
        } else {
            res.send(null);
        }

    } catch (error) {
        res.status(500).send();
    }
});


//add (or remove) item to favorites (and create favorites [in db] if it's the first item)
router.post("", Auth, async (req, res) => {
    const owner = req.user._id;
    const productId = req.body._id;
    console.log(owner);
    console.log(req.body._id);
    console.log(productId);
    try {
        const favorites = await Favorites.findOne({ owner });

        const product = await Product.findOne({ _id: productId })
        if (!product) {
            res.status(404).send({ message: "product not found" });
        }

        const { name, category, images, price, favs } = product
        const image = images[0]

        //If favorites already exists for user,
        if (favorites) {
            const itemIndex = favorites.items.findIndex((item) => item.productId == productId);

            if (itemIndex > -1) {
                favorites.items.splice(itemIndex, 1);
                --product.favs;
            } else {
                favorites.items.push({ productId, name, category, image, price });
                ++product.favs;
            }

            await favorites.save();
            await product.save();
            res.status(200).send(favorites);

        } else {
            //no favorites exists, create one
            const newFav = await Favorites.create({
                owner,
                items: [{ productId, name, category, image, price }]
            });

            ++product.favs;
            await product.save();

            return res.status(201).send(newFav);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("something went wrong");
    }
});


//delete one item in user favorites
router.delete("/", Auth, async (req, res) => {
    const owner = req.user._id;
    const productId = req.query.productId;
    console.log(req.query.productId);

    try {
        let favorites = await Favorites.findOne({ owner });
        const itemIndex = favorites.items.findIndex((item) => item.productId == productId);

        if (itemIndex > -1) {
            favorites.items.splice(itemIndex, 1);

            // favorites = await favorites.save();
            await favorites.save();
            console.log("sssssss");
            res.status(200).send(favorites);
        } else {
            console.log("aaaaaaaaa");
            res.status(404).send("item not found");
        }
    } catch (error) {
        console.log(error);
        console.log("ffffffffffff");
        res.status(400).send();
    }
});


module.exports = router;