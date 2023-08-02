const express = require("express");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

//user add order
exports.addOrder = async (req, res) => {
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
                        currency: "EGP",
                        product_data: {
                            name: item.name
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.quantity,
                })),
                mode: "payment",
                success_url: "http://localhost:3006/success.html",
                cancel_url: "http://localhost:3006/cancel.html",
            })

            const order = await Order.create({
                owner,
                items: cart.items,
                bill: cart.bill,
            });

            const data = await Cart.findByIdAndDelete({ _id: cart.id })

            console.log(session)
            return res.status(200).send(session)
        } else {
            res.status(400).send("No orders found");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("invalid request");
    }
}

/** get all user orders sorted ascending [User]*/
exports.getAllUserOrders = async (req, res) => {
    const { user } = req;
    try {
        const orders = await Order.find({ owner: user._id }).sort({ createdAt: 1 });

        if (!orders) {
            res.status(404).send("No orders found");
        }

        res.status(201).send(orders);
    } catch (error) {
        res.status(400).send("invalid request");
    }
}
//user can cancel order if it's in pending state
exports.deletePendingOrder = async (req, res) => {
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
}


/** get all orders sorted ascending by date [Admin]*/
exports.getAllOrders = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const orders = await Order.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ createdAt: 1 });

        if (!orders) {
            res.status(404).send("No orders found");
        }

        res.status(201).send(orders);
    } catch (error) {
        res.status(400).send("invalid request");
    }
}

// modify order state
exports.modifyOrderState = async (req, res) => {
    const { state } = req.body;
    try {
        const order = await Order.findOneAndUpdate({ _id: req.params.id }, { state: state }, { new: true })

        if (!order) {
            res.status(404).send({ error: "Order not found" })
        }

        await order.save()
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send(error)
    }
}


//#region [User & Admin]
exports.getOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findOne({ _id: orderId });

        if (!order) {
            res.status(404).send("No order found");
        }

        res.status(201).send(order);
    } catch (error) {
        res.status(400).send("invalid request");
    }
}

//get orders by state
exports.getOrdersByState = async (req, res) => {
    const state = req.params.state;
    try {
        const ordersByState = await Order.find({ state });
        // console.log(ordersByState)

        if (!ordersByState) {
            res.status(404).send({ error: `No ${state} orders found` });
        }
        res.status(200).send(ordersByState);
    } catch (error) {
        res.status(400).send(error);
    }
}
//#endregion [User & Admin]
