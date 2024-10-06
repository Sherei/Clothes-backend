const Blog = require("../model/blog");

exports.AddBlog = async (req, res) => {  

// app.post("/blog", async (req, res) => {
    try {
      const newBlog = new Blog(req.body);
      await newBlog.save();
      res.send({ message: "Blog Added" });
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  };
  
  exports.getBlog = async (req, res) => {  

    try {
      const newBlog = await Blog.find().sort({ _id: -1 });
      res.json(newBlog);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  exports.getSingleBlog = async (req, res) => {  

    try {
      const singleBlog = await Blog.findById(req.query.id);
      res.json(singleBlog);
    } catch (e) {
      res.end(e);
    }
  };
  
  exports.DeleteBlog = async (req, res) => {  

    try {
      await Blog.findByIdAndDelete(req.query.id);
      res.end("Delete ho gya");
    } catch (e) {
      res.send(e);
    }
  };
  
  exports.BlogEdit = async (req, res) => {  


    try {
      const blog = await Blog.findById(req.query.id);
      res.json(blog);
    } catch (e) {
      res.status(500).json(e);
    }
  };
  
  exports.UpdateBlog = async (req, res) => {  

    try {
      const blogId = req.body._id;
  
      const existingBlog = await Blog.findById(blogId);
  
      if (!existingBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      existingBlog.title = req.body.title;
      existingBlog.author = req.body.author;
      existingBlog.issueDate = req.body.issueDate;
      existingBlog.image = req.body.image || existingBlog.image;
      existingBlog.introduction = req.body.introduction;
      existingBlog.description1 = req.body.description1;
      existingBlog.description2 = req.body.description2;
      existingBlog.description3 = req.body.description3;
      existingBlog.description4 = req.body.description4;
      existingBlog.description5 = req.body.description5;
      existingBlog.description6 = req.body.description6;
      await existingBlog.save();
      res.json({ message: "Blog Updated" });
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  