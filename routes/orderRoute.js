const express = require("express");
const Auth = require("../middleware/auth");
const AdminAuth = require("../middleware/adminAuth");
const { addOrder, getAllUserOrders, deletePendingOrder, getAllOrders, modifyOrderState, getOrder, getOrdersByState } = require("../controllers/orderController");

const router = new express.Router();

// [User Access]
router.post("/checkout", Auth, addOrder)
router.get("/user/orders", Auth, getAllUserOrders)
router.delete("/:orderId", Auth, deletePendingOrder)

// [Admin Access]
router.get("/all", AdminAuth, getAllOrders)
router.put("/:id", AdminAuth, modifyOrderState)

// [Admin or order owner (User) Access]
router.get("/:orderId", getOrder)
router.get("/state/:state", getOrdersByState)

module.exports = router;
