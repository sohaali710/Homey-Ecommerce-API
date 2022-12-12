const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/cart");
const Auth = require("../middleware/auth");
const AdminAuth = require("../middleware/adminAuth");

const router = new express.Router();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

//user add order
//TODO:check the stripe checkout part with frontend
router.post("/checkout", Auth, async (req, res) => {
    try {
        const owner = req.user._id;

        //find cart and user
        let cart = await Cart.findOne({ owner });
        let user = req.user;

        if (cart) {
            // stripe checkout
            const session = await stripe.checkout.sessions.create({
                line_items: req.body.items.map((item) => ({
                    price_data: {
                        currency: "LE",
                        product_data: {
                            name: item.name
                            // ,
                            // images: [item.image]
                        },
                        unit_amount: item.price,
                    },
                    quantity: item.quantity,
                })),
                mode: "payment",
                success_url: "http://localhost:3006/success.html",
                cancel_url: "http://localhost:3006/cancel.html",
            })


            //order items without product image
            let orderItems = cart.items.map((item) => {
                let orderI = ({ ...item }._doc);// create a new copy from the obj
                delete orderI.image;
                return orderI
            })

            const order = await Order.create({
                owner,
                items: orderItems,
                bill: cart.bill,
            });

            const data = await Cart.findByIdAndDelete({ _id: cart.id })
            res.status(200).json(session)
            return res.status(201).send(order)
        } else {
            res.status(400).send("No orders found");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("invalid request");
    }
});

/** get all orders (same as cart (without product image) but after confirm the order ) sorted ascending 
 * by date [Admin]*/
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

//user can cancel order if it's in pending state
router.delete("/:orderId", Auth, async (req, res) => {
    try {
        let order = await Order.findOne({ _id: req.params.orderId });
        if (order) {
            if (order.state == 'pending') {
                await order.remove();
            } else {
                res.status(400).send("Can't remove this order");
            }
        } else {
            res.status(400).send("No orders found");
        }

        res.status(200).send()
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router;
