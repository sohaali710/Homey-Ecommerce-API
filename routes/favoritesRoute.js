const express = require("express");
const Auth = require("../middleware/auth");
const { getUserFavorites, addRemoveFavorite, deleteFavItem } = require("../controllers/favoritesController");

const router = new express.Router();

router.get("", Auth, getUserFavorites)
router.post("", Auth, addRemoveFavorite)
router.delete("/", Auth, deleteFavItem)

module.exports = router;