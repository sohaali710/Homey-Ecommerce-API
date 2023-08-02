const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId


const cartSchema = new mongoose.Schema({
    owner: {
        type: ObjectID,
        required: true,
        ref: 'User'
    },
    items: [{
        productId: {
            type: ObjectID,
            ref: 'Product',
            required: true
        },
        name: String,
        image: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: Number
    }],
    bill: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})


const Cart = mongoose.model('Cart', cartSchema, 'carts')
module.exports = Cart