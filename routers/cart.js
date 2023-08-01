const express = require("express");
const Cart = require("../models/cart");
const Product = require('../models/Product')
const Auth = require("../middleware/auth");

const router = new express.Router();

//get user cart
router.get("", Auth, async (req, res) => {
    const owner = req.user._id;

    try {
        const cart = await Cart.findOne({ owner });

        if (cart && cart.items.length > 0) {
            res.status(200).send(cart);
        } else {
            res.send(null);
        }

    } catch (error) {
        res.status(500).send();
    }
});


//add item to cart (and create cart [in db] if it's the first item)
router.post("", Auth, async (req, res) => {
    const owner = req.user._id;
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ owner });

        const product = await Product.findOne({ _id: productId })
        if (!product) {
            res.status(404).send({ message: "product not found" });
        }
        const { name, images, price } = product
        const image = images[0]

        //If cart already exists for user,
        if (cart) {
            const itemIndex = cart.items.findIndex((item) => item.productId == productId);

            //check if product exists or not
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, name, image, quantity, price });
            }

            cart.bill = cart.items.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0)

            await cart.save();
            res.status(200).send(cart);

        } else {
            //no cart exists, create one
            const newCart = await Cart.create({
                owner,
                items: [{ productId, name, image, quantity, price }],
                bill: quantity * price,
            });

            return res.status(201).send(newCart);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("something went wrong");
    }
});


//delete one item in user cart
router.delete("/", Auth, async (req, res) => {
    const owner = req.user._id;
    const productId = req.query.productId;

    try {
        let cart = await Cart.findOne({ owner });
        const itemIndex = cart.items.findIndex((item) => item.productId == productId);

        if (itemIndex > -1) {
            // let item = cart.items[itemIndex];
            // cart.bill -= item.quantity * item.price;

            // if (cart.bill < 0) {
            //     cart.bill = 0
            // }

            cart.items.splice(itemIndex, 1);

            cart.bill = cart.items.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0)

            cart = await cart.save();
            res.status(200).send(cart);
        } else {
            res.status(404).send("item not found");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
});


//modify (+ or -) item quantity (from cart page)
router.put("/qmodify", Auth, async (req, res) => {
    const owner = req.user._id;
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ owner });
        const itemIndex = cart.items.findIndex((item) => item.productId == productId);

        if (itemIndex > -1) {
            if (quantity) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                res.status(404).send("quantity can't equal zero");
            }

            cart.bill = cart.items.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0)

            cart = await cart.save();
            res.status(200).send(cart);
        } else {
            res.status(404).send("item not found");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
});

module.exports = router;