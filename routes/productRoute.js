const express = require('express')
const Auth = require('../middleware/auth')
const AdminAuth = require('../middleware/adminAuth');
const { getAllProducts, addReview, getAllPromotions, getPromotionById, getCategoryByNamePromo, addNewProduct, updateProducts, deleteProduct, addPromotion } = require('../controllers/productController');

const router = new express.Router()

// [Admin access]
router.get('/admin/all-products', AdminAuth, getAllProducts);
router.post('/newProduct', AdminAuth, addNewProduct)
router.put("/:id", AdminAuth, updateProducts)
router.delete("/:id", AdminAuth, deleteProduct)
router.put("/promotions/:id", AdminAuth, addPromotion)
//#endregion [only accessed by Admin]

// [User access]
router.get('/user/all-products', Auth, getAllProducts);
router.put("/reviews/:id", Auth, addReview)

// [Any one without Auth]
router.get('/promotions', getAllPromotions)
router.get('/:id', getPromotionById)
router.get('/category/:name', getCategoryByNamePromo)

module.exports = router
