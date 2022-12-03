const express = require("express");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Auth = require("../middleware/auth");
const AdminAuth = require("../middleware/adminAuth");

const router = new express.Router();

//user order
router.post("", Auth, async (req, res) => {
    try {
        const owner = req.user._id;

        //find cart and user
        let cart = await Cart.findOne({ owner });
        let user = req.user;

        if (cart) {
            const order = await Order.create({
                owner,
                items: cart.items,
                bill: cart.bill,
            });

            res.status(201).send(order);
        } else {
            res.status(400).send("No orders found");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("invalid request");
    }
});

//get all orders (same as cart but after confirm the order) sorted ascending by date [Admin]
router.get("/all", AdminAuth, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: 1 });

        if (!orders) {
            res.status(404).send("No orders found");
        }

        res.status(201).send(orders);
    } catch (error) {
        res.status(400).send("invalid request");
    }
});

//get orders by state [Admin]
router.get("/:state", AdminAuth, async (req, res) => {
    const state = req.params.state;
    try {
        const ordersByState = await Order.find({ state: state });

        if (!ordersByState) {
            res.status(404).send({ error: `No ${state} orders not found` });
        }

        res.status(200).send(ordersByState);
    } catch (error) {
        res.status(400).send(error);
    }
});

// modify order state
router.put("/:id/:state", AdminAuth, async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true })

        if (!order) {
            res.status(404).send({ error: "Order not found" })
        }

        await order.save()
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router;