const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
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
    },
    state: {
        type: String,
        required: true,
        default: "pending"
    }
}, {
    timestamps: true
})


const Order = mongoose.model('Order', orderSchema)
module.exports = Order