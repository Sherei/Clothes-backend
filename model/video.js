let mongoose = require("mongoose");

let videoSchema = mongoose.Schema({
  url: String,
  user: String, 
});

let Video = mongoose.model("Video", videoSchema);

module.exports = Video;
