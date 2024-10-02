let mongoose = require("mongoose");

let collectionSchema = mongoose.Schema({
    category: String,
    // subCategory: [{ name: String}], 
    image: String,
    status: {
        type: String,
        default: "active"
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

let Collection = mongoose.model('collection', collectionSchema);

module.exports = Collection;
