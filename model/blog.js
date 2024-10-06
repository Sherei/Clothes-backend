    let mongoose = require("mongoose");

    let blogSchema = mongoose.Schema({
        title:String,
        author:String,
        issueDate:Date,
        introduction:String,
        description1:String,
        description2:String,
        description3:String,
        description4:String,
        description5:String,
        description6:String,
        image:String,
        date: {
            type: Date,
            default: Date.now,
        },
    });

    let Blog = mongoose.model('blog', blogSchema);

    module.exports = Blog;
