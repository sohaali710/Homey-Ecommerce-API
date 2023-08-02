const express = require("express");
const Auth = require("../middleware/auth");
const { getCart, addCartItem, deleteCartItem, modifyItemQuantity } = require("../controllers/cartController");

const router = new express.Router();

router.get("", Auth, getCart)
router.post("", Auth, addCartItem)
router.delete("/", Auth, deleteCartItem)
router.put("/qmodify", Auth, modifyItemQuantity)

module.exports = router;