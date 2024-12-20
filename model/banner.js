let mongoose = require("mongoose");

let bannerSchema = mongoose.Schema({
    title: String,
    image: String,
    date: {
        type: Date,
        default: Date.now,
    },
});

let Banner = mongoose.model('banner', bannerSchema);

module.exports = Banner;
