const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    title: String,
    image: String,
    productId: String,
    userId: String,
    size:String,
    color:String,
    quantity: Number,
    total:Number,
    price: Number,
    sn: Number,
    category: String,
    discount: Number,
    date: {
        type: Date,
        default: Date.now,
    },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
    