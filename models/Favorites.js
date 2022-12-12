const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const favoritesSchema = new mongoose.Schema({
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
        category: String,
        image: String,
        price: Number
    }]
}, {
    timestamps: true
})

const Favorites = mongoose.model('Favorites', favoritesSchema, 'favorites')
module.exports = Favorites