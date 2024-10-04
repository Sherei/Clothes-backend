const Comment = require("../model/comment");


exports.AddComment = async (req, res) => {  

    try {
      console.log("Comments data is :", req.body)
      let ob = { ...req.body };
      delete ob._id;
      const newComment = await Comment.create(ob);
      const allItems = await Comment.find();
      res.send({ message: "Comment Added", alldata: allItems });
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error");
    }
  };
  
  exports.getComment = async (req, res) => {  

    try {
      const comments = await Comment.find().sort({ _id: -1 });
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  exports.deleteComment = async (req, res) => {  

    try {
      await Comment.findByIdAndDelete(req.query.id);
      res.end("Delete ho gya");
    } catch (e) {
      res.send(e);
    }
  };
  