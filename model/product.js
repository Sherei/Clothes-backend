let mongoose = require("mongoose");

let productSchema = mongoose.Schema({
    images: [String],
    title: String,
    description: String,
    colors: [String], // Store selected colors in an array
  sizes: [String], // Store selected sizes in an array
    status:String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        type:String,
        ref: 'Collection',
    },
    sn: {
        type: Number,
        trim: true,
        unique: true,
    },
    discount: {
        type: Number,
        trim: true,
    },
    price: {
        type: Number,
        trim: true,
    },
    Fprice: {
        type: Number,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

let Product = mongoose.model('product', productSchema);

module.exports = Product;
