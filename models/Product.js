const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

//schema for item (product) that user already put in the cart

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 1,
        max: 150000,
        required: true
    },
    dimensions: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    number_of_units: {
        type: Number,
        min: 1,
        max: 20,
        required: true
    },
    number_available: {
        type: Number,
        required: true
    },

    delivery_within: {
        type: String,
        required: true
    },
    made_in: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    __v: {
        type: Number,
        select: false
    }
    ,
    promotions: {
        type: Boolean,
        default: false
    }
    // comments: [
    //     { body: String, date: Date }
    // ],
    // hidden: Boolean,
    // meta: {
    //     votes: Number, //not a rating
    //     favs: Number
    // }
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema, 'products')
module.exports = Product